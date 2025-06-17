$(document).ready(function () {
  let used_participants = parseInt($(`#used_participants`).val(), 10);
  if (used_participants > 0) {
    $("#participantTable").DataTable({
      responsive: true,
      autoWidth: false,
      language: {
        search: "", // remove default label
        searchPlaceholder: "Search participants...",
        lengthMenu: "Show _MENU_ entries",
        info: "Showing _START_ to _END_ of _TOTAL_ entries",
        paginate: {
          previous: "< Back",
          next: "Next >",
        },
      },
      pageLength: 10,
      lengthMenu: [10, 20, 50],
      dom: '<"flex flex-wrap items-center justify-between mb-2"lf>tip',
      initComplete: function () {
        // Custom CSS for search box: add border, rounded, shadow, etc.
        const searchBox = $(this.api().table().container()).find(
          "div.dataTables_filter input"
        );
        searchBox.addClass(
          "border-2 border-blue-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm bg-white text-gray-700"
        );
        searchBox.attr(
          "style",
          "width: 250px; max-width: 100%;  border-radius: 8px !important; padding: 8px !important;"
        );
        // Custom CSS for lengthMenu select
        const lengthMenu = $(this.api().table().container()).find(
          "div.dataTables_length select"
        );
        lengthMenu.addClass(
          "border-2 border-blue-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base bg-white text-gray-700"
        );
        lengthMenu.attr("style", "border-radius: 8px !important;");
        // Custom CSS for pagination
        const paginate = $(this.api().table().container()).find(
          "div.dataTables_paginate span.paginate_button, div.dataTables_paginate a.paginate_button"
        );
        paginate.addClass(
          "border-2 border-blue-400 rounded-lg px-3 py-1 bg-white text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        );

        // Custom CSS for previous button
        const prevBtn = $(this.api().table().container()).find(
          "a.paginate_button.previous"
        );
        prevBtn.attr(
          "style",
          "border-start-start-radius: 8px !important; border-end-start-radius: 8px !important;border: 1px solid rgb(209 213 219 / var(--tw-border-opacity, 1)) !important;"
        );

        // Custom CSS for next button
        const nextBtn = $(this.api().table().container()).find(
          "a.paginate_button.next"
        );
        nextBtn.attr(
          "style",
          "border-start-end-radius: 8px !important; border-end-end-radius: 8px !important;border: 1px solid rgb(209 213 219 / var(--tw-border-opacity, 1)) !important; margin-left: 0px !important;"
        );
      },
    });
  }

  $("#registerForm").on("submit", function (e) {
    e.preventDefault();
    let eventId = $("#eventId").val();
    const data = {
      eventId: $("#eventId").val(),
      titleName: $("#titleName").val(),
      firstName: $("#firstName").val(),
      firstName: $("#firstName").val(),
      middleName: $("#middleName").val(),
      lastName: $("#lastName").val(),
      mobilePhone: $("#mobilePhone").val(),
      participantNumber: $("#participantNumber").val(),
    };
    $.ajax({
      url: "/api/user/events/register",
      type: "POST",
      data: data,
      success: function (response) {
        console.log("Registration response:", response);
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Thank you for registering as a participant.",
          confirmButtonText: "Close",
        }).then(() => {
          window.location.href = `/event/user-participants/${eventId}`;
        });
        $("#registerForm")[0].reset();
      },
      error: function (xhr) {
        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: xhr.responseJSON.message || "Please try again.",
        });
      },
    });
  });

  $(`#mobilePhone`).on("keyup", function (e) {
    let input = $(this).val();
    input = input.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    if (input.length > 10) {
      input = input.slice(0, 10); // Limit to 10 digits
    }
    $(this).val(input);
  });

  $(`#participantList`).on("click", function (e) {
    e.preventDefault();
    $(this).addClass("border border-gray-300 shadow-lg rounded-lg");
    $(`#table-participant`).removeClass("hidden");
    $(`#table-participant`).addClass("block");
    $(`#register-participant`).addClass("hidden");
    $(`#register-participant`).removeClass("block");
    $(`#registerParticipant`).removeClass(
      "border border-gray-300 shadow-lg rounded-lg"
    );
  });

  $(`#registerParticipant`).on("click", function (e) {
    e.preventDefault();
    let remaining_participants = parseInt(
      $(`#remaining_participants`).val(),
      10
    );
    if (remaining_participants <= 0) {
      Swal.fire({
        icon: "error",
        title: "Registration Closed",
        text: "No more participants can be registered for this event.",
      });
      return;
    }

    $(this).addClass("border border-gray-300 shadow-lg rounded-lg");
    $(`#table-participant`).addClass("hidden");
    $(`#table-participant`).removeClass("block");
    $(`#participantList`).removeClass(
      "border border-gray-300 shadow-lg rounded-lg"
    );
    $(`#register-participant`).addClass("block");
    $(`#register-participant`).removeClass("hidden");
  });

  $(`#join_room`).on("click", function (e) {
    let id = $(this).data("id");
    let evetnid = $(this).data("evetnid");
    let participantsid = $(this).data("participantsid");
    if ((!evetnid && !participantsid) || evetnid !== id) {
      Swal.fire({
        title: "Login to Join Room",
        html: `<div class=" flex flex-col gap-1 items-start p-8">
                  <label for="swal-input-phone" class="block text-gray-700 text-xs">Mobile Phone</label>
                  <input id="swal-input-phone" class="w-full h-[50px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your mobile number" maxlength="10" type="tel">
               </div>`,
        showCancelButton: true,
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const phone = document
            .getElementById("swal-input-phone")
            .value.trim();
          if (!/^\d{10}$/.test(phone)) {
            Swal.showValidationMessage(
              "Please enter a valid 10-digit mobile number."
            );
            return false;
          }
          return phone;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // You can handle the login logic here, e.g., send AJAX to verify phone
          $.ajax({
            url: "/api/user/login",
            type: "POST",
            data: { phone: result?.value, id: id },
            success: function (response) {
              if (response.status === 200) {
                Swal.fire({
                  icon: "success",
                  title: "Logged in!",
                  text: "You have successfully logged in.",
                  confirmButtonText: "Close",
                }).then(() => {
                  // Optionally reload or redirect
                  location.href = response.rediirect || "/event/list";
                });
              }
            },
            error: function (xhr) {
              Swal.fire({
                icon: "error",
                title: "Login failed",
                text:
                  xhr.responseJSON?.message ||
                  "Invalid mobile number or server error.",
              });
            },
          });
          // Swal.fire({
          //   icon: "success",
          //   title: "Logged in!",
          //   text: "You have successfully logged in.",
          //   confirmButtonText: "Close",
          // });
        }
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Join Successful!",
        text: "Thank you for join.",
        confirmButtonText: "Close",
      }).then(() => {
        window.location.href = `/event/user-participants/${id}`;
      });
    }
  });
});
