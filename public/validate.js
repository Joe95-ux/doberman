const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const cpassword = document.getElementById("cpassword");

// show error message

function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "input-field error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

//show success message
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.classList.add("success");
}

// check required fields

function checkRequired(inputArr, e) {
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
      return e.preventDefault();
    } else {
      showSuccess(input);
    }
  });
}

// get field name

function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

//check input length

function checkLength(input, min, max, e) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
    return e.preventDefault();
  } else if (input.value.length > max) {
    showError(input, `${getFieldName(input)} must be less ${max} characters`);
    return e.preventDefault();
  } else {
    showSuccess(input);
  }
}

//check that E-mail is valid
function checkEmail(input, e) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim())) {
    showSuccess(input);
  } else {
    showError(input, "E-mail is not valid");
    return e.preventDefault();
  }
}

// check password match

function checkPasswordMatch(input1, input2, e) {
  if (input1.value !== input2.value) {
    showError(input2, "passwords do not match");
    return e.preventDefault();
  }
}

if (form !== null) {
  form.addEventListener("submit", (e) => {
    if (cpassword === null) {
      checkRequired([email, password], e);
    } else {
      checkPasswordMatch(password, cpassword, e);
      checkRequired([email, password, cpassword], e);
    }
    checkLength(password, 8, 25, e);
    checkEmail(email, e);
  });
}
