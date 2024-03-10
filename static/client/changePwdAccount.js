// this is for account section
const change_btn = document.querySelector(".change-password");
const close_btn = document.querySelector(".close-btn-account");

const acc_info = document.querySelector(".account-form");
const change_password_field = document.querySelector(".account-change-password");

const input_field = document.querySelectorAll(".account-input");
const input_submit = document.querySelector(".account-update");


const open_change_pass = (event) => {
    event.preventDefault();
    acc_info.style.filter = "blur(1.5px)";
    change_btn.style.filter = "blur(1.5px)";
    change_password_field.style.display = "block";
    input_field.forEach(element => {
        element.style.pointerEvents = "none";
    });
    input_submit.style.pointerEvents = "none";
};

const hide_change_pass = () => {
    acc_info.style.filter = "blur(0)";
    change_btn.style.filter = "blur(0)";
    change_password_field.style.display = "none";
    input_field.forEach(element => {
        element.style.pointerEvents = "auto";
    });
    input_submit.style.pointerEvents = "auto";
};

change_btn.addEventListener("click", open_change_pass);
close_btn.addEventListener("click", hide_change_pass);
