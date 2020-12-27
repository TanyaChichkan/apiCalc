const links = document.querySelectorAll('.nav-link');
const container = document.querySelectorAll('.content-container');
const wrapper = [...document.querySelectorAll('.wrapper')];
const input = document.querySelector('input[data-item="1"]');
const inputArr = document.querySelectorAll('.radio-group');
const inputDate = document.querySelector('.calc-date');
const inputGroup = [...document.querySelectorAll('.radio-group')];
const h3 = document.querySelectorAll('h3');
const amount1 = document.querySelector('input[data-amount ="1"]');
const amount2 = document.querySelector('input[data-amount ="2"]');
const select1 = document.querySelector('select[data-select ="1"]');
const select = document.querySelector('select[data-select ="0"]');
const selContainer = document.querySelector('.select-container');

const text = document.querySelector('p.text');

let isCreated = false;
let dateValue = "";
let currency1="";
let currency2="";
let result1 = "";
let result2 = "";
let rate = 1;
let obj = {};

document.body.addEventListener('click',handler);


function handler(e){

  let linkActive = e.target;
  let index = e.target.dataset.index;

  addActiveClass(e, index);

  if(linkActive.textContent === "Calculator"){
    chechRadioButton(index);
  }

  if (linkActive.textContent === "Latest rates"){
    fetchData('https://api.exchangeratesapi.io/latest?base=USD', index);

  }

  if (linkActive.textContent === "Historical rates"){
    input.addEventListener('input', e=>{
      dateValue = e.target.value;
      fetchData(`https://api.exchangeratesapi.io/${dateValue}?base=USD`, index);
    });

  }

};


function addActiveClass({target}, index){

  if (target.classList.contains('nav-link')) {
   wrapper.forEach(item => {

     if (index === item.dataset.index) {
      item.classList.add('active');
     } else {
      item.classList.remove('active');
     }

    })
  }
};


function fetchData(url, index){
  fetch(url)
  .then(response=>response.json())
  .then(data=>markupCreation(data, index))
  .catch(err=>console.log(err));
};

let result=0;

function markupCreation(data, index){

  if(index === '0'){
    obj = Object.assign(data.rates);

    document.body.addEventListener('input',e=>{
      if(e.target.dataset.select === "0"){
        currency1 = e.target.value;
        amountGroup(currency1, currency2);
      };

      if(e.target.dataset.select === "1"){
        currency2 = e.target.value;
        amountGroup(currency1, currency2);

      };

    });
  }

  if(index === '1'){
    dateCalc();
    tableCreation(data, index);
    h3[1].classList.add('is-visible');

  };

  if(index === '2'){
    let dateArr = dateValue.split('-');
    let newDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);

    dateCalc(newDate);

    tableCreation(data, index);
    h3[2].classList.add('is-visible');

  };

};


function chechRadioButton(index){

  inputGroup.forEach(el => {

      el.addEventListener('input', e=>{

        if(e.target.id === "selected-date" && e.target.checked === true) {
          inputDate.classList.add('active');

          inputDate.addEventListener('input', e=>{
            if(e.target.value !== ""){
            fetchData(`https://api.exchangeratesapi.io/${e.target.value}?base=USD`, index);
            }
          })
        };

        if(e.target.id === "current-date" && e.target.checked === true){
          inputDate.classList.remove('active');
          fetchData('https://api.exchangeratesapi.io/latest?base=USD', index);
        }

    })
  });
};



function amountGroup(key1, key2){

  let rate1;
  let rate2;

  for(let key in obj){

    if(key === key1){
      rate1 = +obj[key];
    }

    if(key === key2){
      rate2 = +obj[key];
    };

  };
    selContainer.addEventListener('input',e=>{

    if(e.target.dataset.amount === "1"){
      result1 = +(e.target.value);


      if(result1 !== "" && result1 >0){
        amount2.value = (Number(result1 * rate2/rate1)).toFixed(3);
      };

      if(result1 == ""){
        amount2.value = "";
      };

      text.innerHTML = `${result1} ${key1}  equals ${amount2.value}  ${key2}`;

    };

    if(e.target.dataset.amount === "2"){
      result2 = +(e.target.value);

      if(result2 !== "" && result2 >0){
        amount1.value = (Number(result2 * rate1/rate2)).toFixed(3);
      };

      if(result2 == ""){
        amount1.value = "";
      };

      text.innerHTML = `${amount1.value} ${key1}  equals ${result2}  ${key2}`;

    };

  });

};



function tableCreation(data, index){

  let markup = "";
  let obj = data.rates;

    for(let key in obj){
      markup +=  `
      <tr><td>${key}</td><td>${obj[key]}</td></tr>`;
    };

    dateCalc();

  let table = document.querySelector(`table[data-table="${index}"]`);
  table.innerHTML = markup;

};


function dateCalc(dateNew = undefined){

  let date;
  let dateTags = document.querySelectorAll('.date');
  let options = { year: 'numeric', month: 'long', day: 'numeric' };

  if(dateNew === undefined) {
    date = new Date().toLocaleString('en-GB', options);
    dateTags[0].innerHTML = date;
  } else {
    date = dateNew.toLocaleString('en-GB', options);
    dateTags[1].innerHTML = date;

  }

};


document.body.addEventListener('click',e=>{

  if(e.target.nodeName === "BUTTON"){
    text.innerHTML = "";
    amount1.value ="";
    result1 = "";
    result2 = "";
    amount2.value ="";
    select.value = "Choose currency";
    select1.value = "Choose currency";
    inputDate.value = "";

    chechRadioButton(1);
  }

});
