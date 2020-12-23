var apiKey = "<YOUR KEY HERE>"
var hasLocalStorage = false;
var imgNum = 0;
//// TODO: create a settings menu
// TODO: animation
var storage = {}
async function fetchAdvice(){
  console.log("fetching in progress")
  await fetch("https://api.adviceslip.com/advice")
  .then(validateResponse)
  .then(readJSON)
  .then(displayAdvice)
  console.log("complete")
}
function validateResponse(response){
  if(response.ok){
    return response
  } else{
    throw Error("Response not ok.")
  }
}
function readJSON(response){
  return response.json();
}
function displayAdvice(json){
  console.log("displayAdvice starting...")
  let advice = json.slip.advice;
  console.log(advice)
  document.querySelector("#advice").innerText = advice;
  if(hasLocalStorage){
    storage.advice = advice;
  }
  document.querySelector("#advice").classList.add("animate__animated", "animate__flipInX")


}
//<div class="pb-4" id="advice"></div>

function fetchWallpaper(){
  let search = "sun"; //change to random when not testing
  fetch(`https://pixabay.com/api/?key=${apiKey}&q=${search}`,{
    mode: 'cors'
  })
    .then(validateResponse)
    .then(readJSON)
    .then(displayImage)
    .catch(error => {console.log(error)})
}
function displayImage(json){
  let img = json.hits[imgNum].largeImageURL;
  imgNum +=1;
  document.querySelector("#screen").classList.add("animate__animated", "animate__fadeIn")
  document.querySelector("#screen").style=`background-image: url(${img});`
  if(hasLocalStorage){
    storage.img = img;
  }

}


function updateTime(){
  let date = new Date(Date.now());
  let day = dateFns.format(date, 'MMM DD');
  let time = dateFns.format(date, 'h:mm A')
  document.querySelector("#day").innerText=`${day}`
  document.querySelector("#time").innerText=`${time}`
  if(hasLocalStorage){
    storage.day = day;
    storage.time = time;
  }
}

function localStorageSaver() {
  if (hasLocalStorage){
    localStorage.setItem("window-tab-data",JSON.stringify(storage))
  } else {
    console.log("Couldn't Save... no localStorage")
  }
}

function load(){
  if (typeof(Storage) !== "undefined") {
    hasLocalStorage = true;
    let oldStorage = JSON.parse(localStorage.getItem("window-tab-data"));
    if (oldStorage){//oldStorage is null if there is no "window-tab-data"
      storage = oldStorage;
      displayStorage();
      }else {
        localStorage.setItem("window-tab-data", JSON.stringify(storage))
        fetchAdvice();
        fetchWallpaper();
      }
    } else {
      console.log("no load... bc no localStorage")
    }
}
function displayStorage(){
  let img    = storage.img;
  let day    = storage.day;
  let time   = storage.time;
  let advice = storage.advice;
  document.querySelector("#screen").style=`background-image: url(${img});`;
  document.querySelector("#day").innerText=`${day}`;
  document.querySelector("#time").innerText=`${time}`;
  document.querySelector("#advice").innerText = advice;
}
function main(){
  load();
  setInterval(()=>{
    updateTime();
    localStorageSaver();
  }, 1000);
}


document.addEventListener("click",event => {
  setTimeout(()=>{
    document.querySelector("#advice").classList.remove("animate__animated", "animate__flipInX");
  document.querySelector("#screen").classList.remove("animate__animated", "animate__fadeIn");},1000);
  if(event.target.type == "button"){
    let action = event.target.dataset.action;
    this[action]();

  }
});
main();
