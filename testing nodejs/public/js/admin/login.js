$(document).ready(function () {
  $("#togglePassword").on("click", function (e) {
    // Get the input field and eye icon
    var password = $("#password");
    var imgPassword = $("#img-password");
    // Change image source when toggling password visibility
    if (password.attr("type") === "password") {
      imgPassword.attr("src", "/img/eye-password-show.png");
    } else {
      imgPassword.attr("src", "/img/eye-password-hide.png");
    }

    // Toggle the input type between 'password' and 'text'
    var type = password.attr("type") === "password" ? "text" : "password";
    password.attr("type", type);
  });
  $(`#login`).on("submit", function (e) {
    e.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Login failed.",
        text: "Email or Password is required.",
      });
      return false;
    }
    // ตัวอย่างการส่งข้อมูลไปยัง server ด้วย AJAX
    $.ajax({
      url: "/api/admin/login",
      method: "POST",
      data: { email: email, password: password },
      success: function (response) {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Login Successful!",
            confirmButtonText: "Close",
          }).then(() => {
            window.location.href = "/admin/";
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Login failed",
          });
        }
      },
      error: function (xhr) {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: xhr.responseJSON.message || "Please try again.",
        });
      },
    });
  });
});
