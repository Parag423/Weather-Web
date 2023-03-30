const searchTab=document.querySelector(".data-searchWeather");
const yourTab=document.querySelector("[data-userWeather]");
const searchWeatherFormContainer=document.querySelector('.form-container');
const loading=document.querySelector('.loading-container');
const weatherInfo=document.querySelector('.user-info-container');
const grantLocation=document.querySelector('.grant-location-container');
const error = document.querySelector('.error');

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

let oldTab=yourTab;

var userCoordinates ;

oldTab.classList.add('tab-active');

yourWeatherFun();

//swap function 
function swap(newTab){
    if(newTab==searchTab){
        weatherInfo.classList.remove('active');
        searchForCity.value=""
    }
    if(newTab != oldTab){
        searchWeatherFormContainer.classList.remove('active');
        loading.classList.remove('active');
        weatherInfo.classList.remove('active');
        grantLocation.classList.remove('active');
        oldTab.classList.remove('tab-active');
        oldTab=newTab;
        oldTab.classList.add('tab-active');
    }
}

searchTab.addEventListener('click',()=>{
    swap(searchTab);
    searchWeatherFormContainer.classList.add('active');
    error.classList.remove('active');

});

yourTab.addEventListener('click',()=>{
    swap(yourTab);
   yourWeatherFun();

})

 function yourWeatherFun(){
    let cordinatesString =sessionStorage.getItem('cordinate');
    error.classList.remove('active');
    console.log('hello ji',cordinatesString);
    if(!cordinatesString){
        grantLocation.classList.add('active');
    }
    else{
     let cordinatesObj =  JSON.parse(cordinatesString);
    fetchweather(cordinatesObj );
}
}

const grant=document.querySelector('.button')

grant.addEventListener('click', ()=>{
    grantLocation.classList.remove('active');
    console.log("call for getLocation")
    getLocation(); 
})

 async function fetchweather(cordinatesObj){
   error.classList.remove('active');
    loading.classList.add('active');

    let lat = cordinatesObj.lat;
    let lon =cordinatesObj.lon;

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      let jsoncon= await response.json();
      console.log('before  render')
      render(jsoncon);

}




const button=document.querySelector('.btn');
const searchForCity=document.querySelector('[data-searchInput]')


button.addEventListener("click",(e)=>{
    e.preventDefault();
    let city=searchForCity.value;
    if(city=='')return ;
    searchWeatherAPI(city);
    searchWeatherFormContainer.classList.remove('active');
    loading.classList.add('active');
})


const errorText =document.querySelector('.error-text');
const close=document.querySelector('.close');
const wraper =document.querySelector('.wraper');

close.addEventListener('click',()=>{
    error.classList.remove('active');
    searchWeatherFormContainer.classList.add('active');
    searchForCity.value=' '; 
})



async function searchWeatherAPI(city){
    console.log("before respone call");
try{
     let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    var jsonCon = await response.json();
    render(jsonCon);
    }
catch ( e ) {
    console.log("Error: " + e.description );
    errorText.textContent=`Error: ${e.description}`;
    loading.classList.remove('active');
    error.classList.add('active');
    wraper.classList.add('active-error');
  }
}

function render(jsoncon){
    const cityName=document.querySelector('[data-cityName]');
    const flag =document.querySelector('[data-countryIcon]');
    const description= document.querySelector('.weather-desc');
    const  weatherIcon =document.querySelector('.weather-icon');
    const temp=document.querySelector('.weather-temp');
    const  windSpeed =document.querySelector('[data-windspeed]');
    const humidity=document.querySelector('[data-humidity]');
    const cloudness=document.querySelector('[ data-cloudiness]');


    cityName.textContent=jsoncon?.name;
    flag.src=`https://flagcdn.com/144x108/${jsoncon?.sys?.country.toLowerCase()}.png`
    description.textContent=jsoncon?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${jsoncon?.weather?.[0]?.icon}.png`;
    temp.textContent=`${jsoncon?.main?.temp}°C`;
    windSpeed.textContent=`${jsoncon?.wind?.speed}m/s`;
    humidity.textContent=`${jsoncon?.main?.humidity}%`;
    cloudness.textContent=`${jsoncon?.clouds?.all}%`;



    loading.classList.remove('active');
    weatherInfo.classList.add('active');
}

//geolocation 
 function getLocation() {
    if(navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition);
        console.log('getLocation call done');
    }
    else {
        //HW - show an alert for no gelolocation support available
    }

}

function showPosition(position) {
     let cordinates={ 
        lat :position.coords.latitude,
     lon :position.coords.longitude
    };

    sessionStorage.setItem('cordinate',JSON.stringify(cordinates));

    yourWeatherFun();
}

