//นี่คือไฟล์ JavaScript ที่ใช้สำหรับหน้าแรกของเว็บไซต์
document
  .getElementById("get-started-button")
  .addEventListener("click", function () {
    document
      .getElementById("event-section")
      .scrollIntoView({ behavior: "smooth" });
  });

document.addEventListener("DOMContentLoaded", function () {
  const section = document.getElementById("event-section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.remove("opacity-0", "translate-x-10");
          section.classList.add("opacity-100", "translate-x-0");
          observer.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );
  observer.observe(section);
});
