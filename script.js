const T = 0.1;
let f = 1;
let z = 1;
let r = 0;
let {k1, k2, k3} = translate(f, z, r);

document.getElementById('f').addEventListener('input', function() {
  f = document.getElementById('f').value / 1000;
  document.getElementById('f-txt').innerHTML = Number(f).toFixed(2);
  updateGraph();
});
document.getElementById('z').addEventListener('input', function() {
  z = document.getElementById('z').value / 1000;
  document.getElementById('z-txt').innerHTML = Number(z).toFixed(2);
  updateGraph();
});
document.getElementById('r').addEventListener('input', function() {
  r = document.getElementById('r').value / 100;
  document.getElementById('r-txt').innerHTML = Number(r).toFixed(2);
  updateGraph();
});

document.getElementById('switch').addEventListener('input', function(){
  updateGraph();
})

function update_kVals(k1, k2, k3){
  document.getElementById('k1').innerHTML = Number(k1).toFixed(4);
  document.getElementById('k2').innerHTML = Number(k2).toFixed(4);
  document.getElementById('k3').innerHTML = Number(k3).toFixed(4);
}

function updateGraph() {
  const { k1, k2, k3 } = translate(f, z, r);
  const { input_data, feedback } = calculateGraphs(k1, k2, k3);
  update_kVals(k1, k2, k3);
  myChart.data.datasets[0].data = input_data;
  myChart.data.datasets[1].data = feedback;
  myChart.update();
}

function translate(f, z ,r) {
  let k1 = z/ (Math.PI * f);
  let k2 = 1/ ((2 * Math.PI * f) * (2 * Math.PI * f));
  let k3 = r * z / (2 * Math.PI * f);
  return {k1, k2, k3};
}

function calculateGraphs(k1, k2, k3) {
  // constrain k2
  k2 = Math.max(k2, 1.1 * (T*T/4 + T*k1/2));
  
  // initialize variables at 0
  const input_data = [];
  const feedback = [];
  let prev_x = 0;
  let feedback_y = 0;
  let der_y = 0;
  
  for (let x = 0; x <= 10; x+=T) {
    // input function calcuation
    let input = 0;
    if(document.getElementById('switch').checked){
      input = x < 1 ? 0 : x < 2.5 ? 10 : x < 3.5 ? -5 : x < 4.5 ? 20*x-73 : x < 5.5 ? -20*x+103 : 0;
    }else{
      input = x <= 2 ? 0 : 10; //step function
    }
    input_data.push({x, y: input});
    // feedback function calculation
    let der_x = (input - prev_x)/ T;
    feedback_y = feedback_y + T * der_y;
    der_y = der_y + T * (input + k3 * der_x - feedback_y - k1 * der_y)/ k2;
    prev_x = input;
    feedback.push({x, y: feedback_y});
  }
  return {input_data, feedback};
}

const {input_data, feedback} = calculateGraphs(k1, k2, k3);

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [
      {
        label: 'Input Function',
        data: input_data,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },{
        label: 'Feedback Function',
        data: feedback,
        borderColor: 'rgb(192, 75, 192)',
        tension: 0.3
      }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom'
      },
      y: {
        min: -10, max: 20,
        type: 'linear',
        position: 'left'
      }
    }
  }
});

updateGraph();

function adjustAspectRatio() {
    var box = document.querySelector('.UI');
    var maxWidth = 800;  // Maximum content width
    var margin = 30; // Margin on each side
    var availableWidth = window.innerWidth - 2 * margin;
        width = Math.min(availableWidth, maxWidth);
    box.style.width = width + 'px';
    box.style.margin = margin + 'px auto'; // Set margin and center horizontally
}
window.addEventListener('resize', adjustAspectRatio);
document.addEventListener('DOMContentLoaded', adjustAspectRatio);

