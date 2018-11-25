function checkPasswordMatch() {
  let password = document.getElementById('password').value;
  let password2 = document.getElementById('password2').value;
  let message = document.getElementById('passwordMatchMessage');
  if (password == password2) {
    message.innerHTML = '(passwords match)';
    message.classList.remove('text-danger');
    message.classList.add('text-success');
  } else {
    message.innerHTML = '(passwords don\'t match)';
    message.classList.add('text-danger');
    message.classList.remove('text-success');
  }
}

function validateRegisterForm() {
  let password = document.getElementById('password').value;
  let password2 = document.getElementById('password2').value;
  if (password != password2) {
    document.getElementById('passwordMatchMessage').classList.add('flicker');
    setTimeout(() => {
      document.getElementById('passwordMatchMessage').classList.remove('flicker');
    }, 3000);
    return false;
  }
  if (password.length < 6) {
    document.getElementById('passwordLengthMessage').style.opacity = '1';
    setTimeout(() => {
      document.getElementById('passwordLengthMessage').style.opacity = '0';
    }, 4000);
    return false;
  }
}

$(() => {
  const colors = ['primary', 'success', 'danger', 'warning', 'info', 'light'];
  let btnGroupColors = Array.from($('.btnGroupColor'));
  let btnGroupColorMenus = Array.from($('.btnGroupColorMenu'));
  for (let i = 0; i < btnGroupColorMenus.length; i++) {
    let labels = Array.from(btnGroupColorMenus[i].getElementsByTagName('label'));
    labels.forEach((label, labelIndex) => {
      label.onclick = () => {
        console.log(1);
        colors.forEach(color => {
          btnGroupColors[i].classList.remove('btn-' + color);
        });
        btnGroupColors[i].classList.add('btn-' + colors[labelIndex]);
      }
    });
  }
});