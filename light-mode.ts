const checkbox = document.getElementById("checkbox") as HTMLInputElement | null;
if (checkbox) {
  checkbox.addEventListener("change", () => {
    document.body.classList.toggle("light");
    document.querySelector(".menu-button")?.classList.toggle("light");
    console.log("light mode");

  });
}
