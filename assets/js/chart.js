$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "https://wakatime.com/share/@aldotobing/c56bcfc6-b404-4903-93e9-461dce180648.json",
    dataType: "jsonp",
    success: function (response) {
      const data = response.data;
      const sortedData = data.sort((a, b) => b.percent - a.percent);
      const labels = sortedData.map(
        (item) => `${item.name} (${item.percent.toFixed(2)}%)`
      );
      const percentages = sortedData.map((item) => item.percent);
      const colors = sortedData.map((item) => item.color);

      const ctx = document.getElementById("wakatimeChart").getContext("2d");

      const isDarkMode = document.body.classList.contains("dark-mode");
      const textColor = isDarkMode ? "#c0c0c0" : "#555";

      new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              data: percentages,
              backgroundColor: colors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 20,
              bottom: 20,
            },
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: textColor,
                font: {
                  size: 11,
                  family: "'Helvetica Neue', 'Arial', sans-serif",
                  weight: "500",
                },
                boxWidth: 12,
                padding: 10,
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}%`;
                },
              },
              backgroundColor: isDarkMode
                ? "rgba(50, 50, 50, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
              titleColor: isDarkMode ? "#fff" : "#333",
              bodyColor: isDarkMode ? "#e0e0e0" : "#555",
              borderColor: isDarkMode ? "#555" : "#ddd",
              borderWidth: 1,
            },
            datalabels: {
              color: function (context) {
                const value = context.dataset.data[context.dataIndex];
                return value > 5 ? "#fff" : "#333";
              },
              align: "center",
              formatter: function (value, context) {
                if (context.dataIndex < 3) {
                  return `${
                    context.chart.data.labels[context.dataIndex].split(" ")[0]
                  }\n${value.toFixed(1)}%`;
                }
                return null;
              },
              font: {
                size: 11,
                weight: "500",
                family: "'Helvetica Neue', 'Arial', sans-serif",
              },
              textShadow: "0px 0px 2px rgba(0, 0, 0, 0.5)",
            },
          },
        },
        plugins: [ChartDataLabels],
      });
    },
  });
});
