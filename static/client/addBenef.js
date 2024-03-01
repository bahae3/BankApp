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


// this is for beneficiary section
const add_btn = document.querySelector(".benef-add");
const hide_btn = document.querySelector(".close-btn");

const all_benef_section = document.querySelector(".all-benef");
const benef_add_data = document.querySelector(".benef-add-data");

const open_add_benef = (event) => {
    event.preventDefault();
    if(all_benef_section){
        all_benef_section.style.filter = "blur(1.5px)";
        // all_benef_section.classList.toggle("unscrollable");
    }
    add_btn.style.filter = "blur(1.5px)";
    add_btn.classList.toggle("unscrollable");

    benef_add_data.style.display = "block";
};

const hide_add_benef = () => {
    add_btn.style.filter = "blur(0)";
    add_btn.classList.remove("unscrollable");

    if(all_benef_section){
        all_benef_section.style.filter = "blur(0)";
        // all_benef_section.classList.remove("unscrollable");
    }

    benef_add_data.style.display = "none";
}

add_btn.addEventListener("click", open_add_benef);
hide_btn.addEventListener("click", hide_add_benef);