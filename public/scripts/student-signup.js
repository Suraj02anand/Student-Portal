let username = document.getElementById("username");
let mobile_number = document.getElementById("mobile-number");
let student_name = document.getElementById("student-name");
let password = document.getElementById("password");
let confirm_password = document.getElementById("confirm-password");

document.body.addEventListener("click", () => {
  call();
});

document.body.addEventListener("keypress", () => {
  call();
});

document.getElementById("signUp").addEventListener("click", () => {
  let flag = 1;
  if (username.value.length !== 13) {
    username.classList.add("is-invalid");
    flag = 0;
  }

  if (student_name.value.length < 3) {
    student_name.classList.add("is-invalid");
    flag = 0;
  }
  if (mobile_number.value.length < 10) {
    mobile_number.classList.add("is-invalid");
    flag = 0;
  }
  if (password.value.length < 8) {
    password.classList.add("is-invalid");
    flag = 0;
  }
  if (
    password.value.length === 0 ||
    password.value !== confirm_password.value
  ) {
    confirm_password.classList.add("is-invalid");
    flag = 0;
  }
  if (flag === 1) {
    username.classList.add("is-valid");
    mobile_number.classList.add("is-valid");
    student_name.classList.add("is-valid");
    password.classList.add("is-valid");
    confirm_password.classList.add("is-valid");
    document.forms.myForm.submit();
    return true;
  }
});

function call() {
  if (username.value.length === 13) {
    username.classList.remove("is-invalid");
    username.classList.add("is-valid");
    console.log("first");
  }
  if (student_name.value.length >= 3) {
    student_name.classList.remove("is-invalid");
    student_name.classList.add("is-valid");
  }
  if (mobile_number.value.length === 10) {
    mobile_number.classList.remove("is-invalid");
    mobile_number.classList.add("is-valid");
  }

  if (password.value.length >= 8) {
    password.classList.remove("is-invalid");
    password.classList.add("is-valid");
  }
  if (
    password.value.length !== 0 &&
    password.value === confirm_password.value
  ) {
    confirm_password.classList.remove("is-invalid");
    confirm_password.classList.add("is-valid");
  }

  if(  password.value.length !== 0 && password.value !== confirm_password.value){
    confirm_password.classList.add("is-invalid");
  }
}
