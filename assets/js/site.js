// Click any screenshot to view it full size; click again or press Esc to close.
(function () {
  var box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = '<button aria-label="Close">&times;</button><img alt="">';
  document.body.appendChild(box);
  var big = box.querySelector("img");

  function close() { box.classList.remove("open"); big.src = ""; }

  document.querySelectorAll(".shot img").forEach(function (img) {
    img.addEventListener("click", function () {
      big.src = img.src;
      big.alt = img.alt;
      box.classList.add("open");
    });
  });
  box.addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
