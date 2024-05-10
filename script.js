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

function update_kVals(k1, k2, k3){
  document.getElementById('k1').innerHTML = Number(k1).toFixed(4);
  document.getElementById('k2').innerHTML = Number(k2).toFixed(4);
  document.getElementById('k3').innerHTML = Number(k3).toFixed(4);
}

function updateGraph() {
  const { k1, k2, k3 } = translate(f, z, r);
  const { step_data, feedback } = calculateGraphs(k1, k2, k3);
  update_kVals(k1, k2, k3);
  myChart.data.datasets[0].data = step_data;
  myChart.data.datasets[1].data = feedback;
  myChart.update();
}

function translate(f, z ,r) {
  let k1 = z/ (Math.PI * f);
  let k2 = 1/ ((2 * Math.PI * f) * (2 * Math.PI * f));
  let k3 = r * z / (2 * Math.PI * f);
  return {k1, k2, k3};
}

function calculateGraphs(a, b, c) {
  const step_data = [];
  const feedback = [];
  //initialize values to start at 0
  let prev_x = 0;
  let feedback_y = 0;
  let der_y = 0;
  
  for (let x = 0; x <= 10; x+=T) {
    let step_y = x < 1 ? 0 : 5;
    let der_x = (step_y - prev_x)/ T;
    b = Math.max(b, 1.1 * (T*T/4 + T*a/2)); 
    //b = Math.max(b, 0.5 + a/2, a); 
    feedback_y = feedback_y + T * der_y;
    der_y = der_y + T * (step_y + c * der_x - feedback_y - a * der_y)/ b;
    prev_x = step_y;
    //push the data
    step_data.push({x, y: step_y });
    feedback.push({x, y: feedback_y});
  }
  return {step_data, feedback};
}

const {step_data, feedback} = calculateGraphs(k1, k2, k3);

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [
      {
        label: 'Step Function',
        data: step_data,
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
        min: -5, max: 20,
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
