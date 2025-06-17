$(document).ready(function () {
  $("#editForm").on("submit", function (e) {
    e.preventDefault();
    const data = {
      eventId: $("#eventId").val(),
      participant_id: $("#participant_id").val(),
      titleName: $("#titleName").val(),
      firstName: $("#firstName").val(),
      firstName: $("#firstName").val(),
      middleName: $("#middleName").val(),
      lastName: $("#lastName").val(),
      mobilePhone: $("#mobilePhone").val(),
      participantNumber: $("#participantNumber").val(),
      status: $("#status").val(),
    };
    $.ajax({
      url: "/api/admin/events/edit",
      type: "POST",
      data: data,
      success: function (response) {
        console.log("response", response);
        Swal.fire({
          icon: "success",
          title: "Successful!",
          confirmButtonText: "Close",
        }).then(() => {
          window.location.href = `/admin/event/${data.eventId}`;
        });
      },
      error: function (xhr) {
        Swal.fire({
          icon: "error",
          title: "Edit failed",
          text: xhr.responseJSON.message || "Please try again.",
        });
      },
    });
  });
});
