const defaultTable = {
  "depos" : [
    {"name" : "Имя Депо",
      "routes" : [
        {"route_number" : "4А",
          "plan_morning": 45,
          "plan_evening" : 151,
          "plan_current_date" : 350},
        {"route_number" : "17",
          "plan_morning": 10,
          "plan_evening" : 51,
          "plan_current_date" : 213},
        {"route_number" : "45",
          "plan_morning": 12,
          "plan_evening" : 56,
          "plan_current_date" : 200}
      ]},
    {"name" : "Имя Депо2",
      "routes" : [
        {"route_number" : "6",
          "plan_morning": 13,
          "plan_evening" : 100,
          "plan_current_date" : 400},
        {"route_number" : "17",
          "plan_morning": 10,
          "plan_evening" : 44,
          "plan_current_date" : 150},
        {"route_number" : "26",
          "plan_morning": 19,
          "plan_evening" : 48,
          "plan_current_date" : 120}
      ]},
]
};
const factReactClasses = ['n3', 'n4', 'n5', 'n6', 'n7', 'n8']
let selectedRow = null;

document.addEventListener('DOMContentLoaded', ()=>{
  const elem = document.getElementById('finddate');
  const today = new Date().toLocaleDateString('af-ZA');
  elem.value = today;
  elem.max = today;
});


document.addEventListener('DOMContentLoaded', ()=>{
  getDepots()
      .then(res => {
        createTable(res)
      });

});


const getDepots = () => new Promise(resolve => {
  // fetch('', {
  //   method: 'GET',
  // })
  //     .then(response=> response.ok ? resolve(response) : reject(new Error(response.statusText)))
  //     .catch(error =>  reject(error))
  setTimeout(() => resolve(defaultTable), 200);
})

const createTable = (tableData) => {
  if (tableData.depos && tableData.depos.length > 0){
    let table = document.getElementById('form__container__tbody');
    table.onclick = tbodyClickHandler;
    table.onchange = tbodyChangeHandler
    tableData.depos.forEach((depo)=>{
      depo.routes.forEach((route, index) => {
        table.insertAdjacentHTML('beforeend',
          `<tr class="data_insert">
                  <td class="route_number">${route.route_number}</td>
                  ${!index ? `<td class="depo_name" rowspan="${depo.routes.length}">${depo.name}</td>` : ''}
                  <td class="plan-7-15">${route.plan_morning}</td>
                  <td class="fact-7-15"><input type="number" name='fact-7-15' class="n1"/>
                </td>
                  <td class="plan-18-00">${route.plan_evening}</td>
                  <td class="fact-18-00">
                    <input type="number" name='fact-18-00' class="n2"/>
                  </td>
                  <td class="plan_today">${route.plan_current_date}</td>
                  <td class="fact_today">${route.plan_current_date}</td>
                  <td class="brak">
                    <input type="number" name="brak" class="n3"/>
                  </td>
                  <td class="delay">
                    <input type="number" name="delay" class="n4"/>
                  </td>
                  <td class="speed-deceleration-dkr_kr">
                    <input type="number" name="speed-deceleration-dkr_kr" class="n5" />
                  </td>
                  <td class="speed-deceleration">
                    <input type="number" name="speed-deceleration" class="n6" />
                  </td>
                  <td class="switch-tu">
                    <input type="number" name="switch-tu" class="n7"/>
                  </td>
                  <td class="total-by-route"></td>
              <td class="total-by-route_percent"></td>
                  <td class="flights-off-the-plan">
                    <input type="number" name="flights-off-the-plan" class="n8" />
                  </td>
                  <td class="average-speed-plan">
                    <input type="number" name="average-speed-plan" class="n9" />
                  </td>
                  <td class="average-speed-fact">
                    <input type="number" name="average-speed-fact" class="n10"/>
                  </td>
                  <td class="for-button">
                    <button class="small-button save-data">Сохранить</button>
                    <button class="small-button change-data" style="display: none">Изменить</button>
                  </td>
                </tr>`
        );
      });
    })
  }
  else{
    console.log('err');
  }
}

const tbodyClickHandler = (e) => {
  if (e.target.classList.contains('save-data')){
    showModal(e);
  }
  else if (e.target.classList.contains('change-data')){
    let rowIndex = e.target.parentElement.parentElement.rowIndex;
    [].forEach.call(
        getInputs(rowIndex), element => {
          element.children[0].disabled = false;
        }
    )
    changeButton(rowIndex);
  }
}

const tbodyChangeHandler = (e) => {
  +e.target.value <= 0 ? e.target.value = '' : null;
  for (let value of factReactClasses){
    if (e.target.classList.contains(value)){
      let rowIndex = e.target.parentElement.parentElement.rowIndex
      let row = document.getElementById('main-table').rows[rowIndex]
      let plan = [].filter.call(
          row.cells, element => element.classList.contains('plan_today')
      )[0];
      let fact = [].filter.call(
          row.cells, element => element.classList.contains('fact_today')
      )[0];
      let inputs = getInputs(rowIndex);
      let factReact = 0
      for (let i = 2; i<=6; i++)
        factReact -= +inputs[i].children[0].value
      factReact += +inputs[7].children[0].value
      fact.innerText = String(+plan.innerText + factReact);
      break;
    }
  }
}

const  showModal = (e) => {
  document.getElementById('save-modal').classList.add('modal__show');
  selectedRow = e.target.parentElement.parentElement.rowIndex;
  console.log(selectedRow)
}

const  hideModal = () => {
  document.getElementById('save-modal').classList.remove('modal__show');
}

const postRow = (body) => new Promise((resolve, reject) => {
  // fetch('', {
  //   method: 'POST',
  //   body: JSON.stringify(body)
  // })
  //     .then(response=> response.ok ? resolve(response) : reject(new Error(response.statusText)))
  //     .catch(error =>  reject(error))
  resolve()
})

const getInputs = (rowIndex) => {
  let row = document.getElementById('main-table').rows[rowIndex];
  return [].filter.call(
      row.cells, element => {
        if (element.children && element.children.length > 0)
          return (element.children[0].tagName === 'INPUT')
      }
  )
}

const changeButton = (rowIndex) =>{
  let row = document.getElementById('main-table').rows[rowIndex];
  let btnCell = row.lastElementChild
  if (btnCell.children[0].style.display === 'none'){
    btnCell.children[1].style.display = 'none'
    btnCell.children[0].style.display = 'block'
  }
  else {
    btnCell.children[0].style.display = 'none'
    btnCell.children[1].style.display = 'block'
  }
}

const saveModalBtn = ()=> {
  let body = {};
  let inputs = getInputs(selectedRow);
  [].forEach.call(
      inputs, element => {
        body[element.children[0].name] = element.children[0].value
      }
  )
  postRow(body)
      .then(
          response => {
            [].forEach.call(
                inputs, element => {
                  element.children[0].disabled = true;
                }
            )
            changeButton(selectedRow)
            hideModal()
          },
          error => console.log(error)

      )

}
