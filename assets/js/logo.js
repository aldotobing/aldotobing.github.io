document.addEventListener("DOMContentLoaded", () => {
  const logos = document.querySelectorAll(".logo");
  const popupOverlay = document.querySelector(".popup-overlay");
  const popupTitle = document.getElementById("popup-title");
  const popupDescription = document.getElementById("popup-description");
  const closePopupButton = document.querySelector(".close-popup");

  const techDescriptions = {
    Java: "Java is a versatile, object-oriented programming language that empowers developers with its 'write once, run anywhere' capability, making it ideal for building robust, cross-platform applications across various environments.",
    Golang:
      "Go, or Golang, is a statically typed, compiled language designed for simplicity and efficiency. Its built-in concurrency support allows developers to create scalable and high-performance applications with ease.",
    PostgreSQL:
      "PostgreSQL is a powerful, open-source relational database system that offers advanced data types, extensibility, and compliance with SQL standards. It is renowned for its ability to handle complex queries and provide reliable data integrity.",
    Docker:
      "Docker is a leading platform for developing, shipping, and running applications in lightweight containers. It ensures consistency across development, testing, and production environments, enabling rapid deployment and efficient resource utilization.",
    Linux:
      "Linux is a family of open-source operating systems that are widely embraced for their flexibility, security, and robustness. It powers the majority of web servers and cloud infrastructure, providing a reliable environment for software development.",
    Nginx:
      "Nginx is a high-performance web server and reverse proxy that excels in serving static content and handling concurrent connections. Its lightweight architecture makes it a preferred choice for modern web applications that require scalability and speed.",
    Tildeslash:
      "Tildeslash Monit is a sophisticated monitoring tool that delivers real-time insights and alerts regarding system performance and application health. It enables proactive management of infrastructure to ensure optimal performance and reliability.",
    Bitbucket:
      "Bitbucket is a powerful collaboration platform tailored for software development teams. It offers integrated Git and Mercurial repository hosting, along with features for code review, issue tracking, and continuous delivery.",
    Redis:
      "Redis is an advanced in-memory key-value store known for its exceptional speed and performance. It is widely used as a caching layer in applications, enhancing response times and enabling high-throughput data access.",
    AWS: "Amazon Web Services (AWS) is a comprehensive cloud computing platform that offers an extensive suite of services, including computing power, storage options, and advanced analytics. It provides scalable solutions to meet the diverse needs of businesses globally.",
  };

  logos.forEach((logo) => {
    logo.addEventListener("click", () => {
      const tech = logo.getAttribute("data-tech");
      popupTitle.textContent = tech;
      popupDescription.textContent =
        techDescriptions[tech] || "Description not available.";

      // Animate the clicked logo
      logo.style.transform = "scale(1.2) translateY(-20px)";
      logo.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.3)";

      // Show the popup
      popupOverlay.classList.add("active");

      // Reset the logo after animation
      setTimeout(() => {
        logo.style.transform = "";
        logo.style.boxShadow = "";
      }, 300);
    });
  });

  closePopupButton.addEventListener("click", () => {
    popupOverlay.classList.remove("active");
  });

  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.classList.remove("active");
    }
  });
});
