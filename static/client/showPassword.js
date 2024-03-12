const show_button = document.querySelector(".show-password");

const passsword = document.querySelector("#password");

const show_password = () => {
    if (password.getAttribute("type") === "password"){
        password.setAttribute("type", "text");
        show_button.text = "Hide password";
    }
    else{
        password.setAttribute("type", "password");
        show_button.text = "Show password";
    }
}

show_button.addEventListener("click", show_password);