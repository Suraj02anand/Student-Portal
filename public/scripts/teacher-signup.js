let staff_name = document.getElementById("staff-name");
let username = document.getElementById("username");
let mobile_number = document.getElementById("mobile-number");
let password = document.getElementById("password");
let confirm_password = document.getElementById("confirm-password");

document.body.addEventListener("click", () => {
  if (staff_name.value.length >= 3) {
    staff_name.classList.remove("is-invalid");
    staff_name.classList.add("is-valid");
    console.log("first");
  }
  if (mobile_number.value.length === 10) {
    mobile_number.classList.remove("is-invalid");
    mobile_number.classList.add("is-valid");
  }
  if (username.value.length >= 5) {
    username.classList.remove("is-invalid");
    username.classList.add("is-valid");
  }
  if (password.value.length >= 8) {
    password.classList.remove("is-invalid");
    password.classList.add("is-valid");
  }
  if (password.value.length != 0 && password.value === confirm_password.value) {
    confirm_password.classList.remove("is-invalid");
    confirm_password.classList.add("is-valid");
  }
});

document.getElementById("signUp").addEventListener("click", () => {
  let flag = 1;
  if (staff_name.value.length < 3) {
    staff_name.classList.add("is-invalid");
    flag = 0;
  }
  if (mobile_number.value.length !== 10) {
    mobile_number.classList.add("is-invalid");
    flag = 0;
  }
  if (username.value.length < 5) {
    username.classList.add("is-invalid");
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
    staff_name.classList.add("is-valid");
    username.classList.add("is-valid");
    mobile_number.classList.add("is-valid");
    password.classList.add("is-valid");

    console.log("Success");
    document.forms.myForm.submit();
    return true;
  }
});
