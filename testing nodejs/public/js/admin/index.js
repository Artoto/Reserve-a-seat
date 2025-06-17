$(document).ready(function () {
  let currentPage = 1;
  let totalPages = 0;
  const itemsPerPage = 6;

  // Function to fetch and display events
  function fetchEvents(page = 1, search = "") {
    $.ajax({
      url: "/api/user/events/list", // Endpoint to fetch events from the server
      method: "POST",
      data: {
        page: page,
        search: search,
        limit: itemsPerPage,
      },
      success: function (response) {
        const data = response.data;
        $(`#div-event`).addClass("h-auto");
        $(`#eventsNotfound`).addClass("hidden");
        $(`#eventsNotfound`).removeClass("flex");
        $(`#eventsList`).removeClass("hidden");
        totalPages = Math.ceil(data.length / itemsPerPage);
        renderEvents(data);
        renderPagination();
      },
      error: function () {
        $(`#div-event`).addClass("h-screen");
        $(`#eventsNotfound`).removeClass("hidden");
        $(`#eventsNotfound`).addClass("flex");
        $(`#eventsList`).addClass("hidden");
        Swal.fire("Error", "Could not fetch events", "error");
      },
    });
  }

  // Render events into the DOM
  function renderEvents(events) {
    const eventsList = $("#eventsList");
    eventsList.empty(); // Clear the events list

    if (events.length === 0) {
      eventsList.append(
        '<div class="col-span-4 text-center">No events found.</div>'
      );
    } else {
      events.forEach((event) => {
        const eventCard = `
        <div class="rounded overflow-hidden shadow-lg flex flex-col">
          <div class="relative">
            <a href="/admin/event/${event._id}">
              <img
                class="w-full"
                src="${
                  event.et_image
                    ? `/img/event/${event.et_image}`
                    : "/img/event/default.png"
                }"
                alt="Sunset in the mountains"
                onerror="this.onerror=null;this.src='/img/event/default.png';"
              />
              <div
                class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"
              ></div>
            </a>
            <a href="/admin/event/${event._id}">
            ${
              event.use_participants < event.et_participant
                ? `
               <div class="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                ${event.use_participants} / ${event.et_participant}
              </div>
              `
                : `
                <div class="text-xs absolute top-0 right-0 bg-red-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-red-600 transition duration-500 ease-in-out">
                  Full
                </div>
              `
            }
            </a>
          </div>
          <div class="px-6 py-4 mb-auto">
            <a
              href="/admin/event/${event._id}"
              class="font-medium text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2"
              >${event.et_name}</a
            >
            <p class="text-gray-500 text-sm">${event.et_description}</p>
          </div>
          <div class="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
            <span class="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
              <img src="/img/event/clock.png" alt="clock" class="h-5 w-5" />
              <span class="ml-1">
                ${new Date(event.et_create_at).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </span>
            </span>

            <span class="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
              <img src="/img/event/map-pin.png" alt="map-pin" class="h-5 w-5" />
              <span class="ml-1">${event.et_location}</span>
            </span>
          </div>
        </div>
              `;
        eventsList.append(eventCard);
      });
    }
  }

  // Render pagination buttons
  function renderPagination() {
    const pagination = $("#pagination");
    pagination.empty();

    // Previous Button
    if (currentPage >= 1) {
      pagination.append(`
              <button id="prevPage" class="border border-gray-300 rounded-tl-lg rounded-bl-lg rounded-tr-none rounded-br-none w-auto h-10 px-4 py-[10px] flex item-center">Previous</button>
            `);
    }

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
      pagination.append(`
              <button class="w-auto h-10 px-4 py-[10px] flex item-center border  ${
                i === currentPage
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700"
              }" data-page="${i}">${i}</button>
            `);
    }

    // Next Button
    if (currentPage <= totalPages) {
      pagination.append(`
              <button id="nextPage" class="border border-gray-300 rounded-tr-lg rounded-br-lg rounded-tl-none rounded-bl-none  w-auto h-10 px-4 py-[10px] flex item-center">Next</button>
            `);
    }
  }

  // Pagination Button Click
  $(document).on("click", "#pagination button", function () {
    const page = $(this).data("page");
    if (page) {
      currentPage = page;
    } else if ($(this).attr("id") === "prevPage" && currentPage > 1) {
      currentPage--;
    } else if ($(this).attr("id") === "nextPage" && currentPage < totalPages) {
      currentPage++;
    }
    fetchEvents(currentPage, $("#searchInput").val());
  });

  // Search Input Change
  $("#searchInput").on("input", function () {
    const searchQuery = $(this).val();
    fetchEvents(1, searchQuery);
  });

  // Initial fetch of events
  fetchEvents(currentPage);
});
