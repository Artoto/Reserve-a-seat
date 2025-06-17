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

  let draggedElement = null;

  // เมื่อเริ่มลาก
  $(".draggable").on("dragstart", function (e) {
    draggedElement = e.target;
    e.originalEvent.dataTransfer.setData("text", e.target.id); // ใช้ id หรือ data-id ในการเก็บข้อมูล
  });

  // เมื่อปล่อยภาพในตำแหน่งใหม่
  $(".grid").on("dragover", function (e) {
    e.preventDefault(); // ทำให้สามารถปล่อยภาพได้
  });

  $(".grid").on("drop", function (e) {
    e.preventDefault();

    let data = e.originalEvent.dataTransfer.getData("text"); // ดึงข้อมูลจากการลาก
    let droppedElement = document.getElementById(data); // ใช้ข้อมูลจาก data-id หรือ id
    let target = e.target;

    if (target && target.tagName === "IMG") {
      // กำหนด draggedIndex และ targetIndex โดยใช้ data-id หรือ data-up_no
      let draggedIndex = $(draggedElement).data("id") + 1;
      let targetIndex = $(target).data("id") + 1;

      // ตรวจสอบว่าค่าของ draggedIndex และ targetIndex ถูกต้อง
      let tempSrc = $(droppedElement).attr("src");
      $(droppedElement).attr("src", $(target).attr("src"));
      $(target).attr("src", tempSrc);

      let tempId = $(droppedElement).data("id");
      $(droppedElement).data("id", $(target).data("id"));
      $(target).data("id", tempId);
      if (draggedIndex && targetIndex) {
        // ส่งข้อมูลที่อัปเดตไปยังเซิร์ฟเวอร์ (update db)
        $.ajax({
          url: "/api/admin/event/update-participant", // API ที่จะอัปเดต
          type: "POST",
          data: {
            event_id: $("#event_id").val(), // ส่ง event_id
            draggedIndex: draggedIndex, // ดัชนีของภาพที่ถูกลาก
            targetIndex: targetIndex, // ดัชนีของภาพที่เป็นเป้าหมาย
          },
          success: function (response) {
            if (response.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Update Successful!",
                confirmButtonText: "Close",
              }).then(() => {
                window.location.reload(); // รีโหลดหน้า
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Update failed",
              });
            }
          },
          error: function (xhr, status, error) {
            Swal.fire({
              icon: "error",
              title: "Update failed",
              text: xhr.responseJSON.message || "Please try again.",
            });
          },
        });
      }
    }
  });

  $(`.bt-del`).on("click", function (e) {
    e.preventDefault();
    const participantId = $(this).data("id");
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "/api/admin/event/delete-participant",
          type: "POST",
          data: {
            eventId: $("#event_id").val(),
            participant_id: participantId,
          },
          success: function (response) {
            if (response.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Participant has been deleted.",
                confirmButtonText: "Close",
              }).then(() => {
                window.location.reload();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Delete failed",
                text: response.message || "Please try again.",
              });
            }
          },
          error: function (xhr) {
            Swal.fire({
              icon: "error",
              title: "Delete failed",
              text: xhr.responseJSON?.message || "Please try again.",
            });
          },
        });
      }
    });
  });
});
