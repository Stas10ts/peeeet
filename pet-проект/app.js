const form = document.querySelector(".search-form");
const originInput = document.querySelector("#origin");
const destinationInput = document.querySelector("#destination");
const swapButton = document.querySelector("#swap-route");
const suggestions = document.querySelector("#airport-suggestions");

const cityByValue = new Map(
  Array.from(suggestions.options, (option) => [
    option.value.toLocaleLowerCase("ru"),
    option.dataset.city,
  ]),
);

function getCityId(input) {
  return cityByValue.get(input.value.trim().toLocaleLowerCase("ru"));
}

function setFieldError(input, message) {
  const error = document.querySelector(`#${input.id}-error`);
  error.textContent = message;
  error.hidden = !message;
  input.setAttribute("aria-invalid", String(Boolean(message)));
}

function validateRoute() {
  const originCity = getCityId(originInput);
  const destinationCity = getCityId(destinationInput);

  setFieldError(
    originInput,
    originInput.value.trim()
      ? originCity ? "" : "Выберите город или аэропорт из подсказок."
      : "Укажите город отправления.",
  );
  setFieldError(
    destinationInput,
    destinationInput.value.trim()
      ? destinationCity ? "" : "Выберите город или аэропорт из подсказок."
      : "Укажите город назначения.",
  );

  if (originCity && destinationCity && originCity === destinationCity) {
    setFieldError(originInput, "Города отправления и назначения не должны совпадать.");
    setFieldError(destinationInput, "Выберите другой город или аэропорт.");
  }

  return Boolean(originCity && destinationCity && originCity !== destinationCity);
}

form.addEventListener("submit", (event) => {
  if (!validateRoute()) {
    event.preventDefault();
    [originInput, destinationInput].find((input) => input.getAttribute("aria-invalid") === "true").focus();
    return;
  }

  if (!form.reportValidity()) {
    event.preventDefault();
  }
});

for (const input of [originInput, destinationInput]) {
  input.addEventListener("input", () => {
    setFieldError(originInput, "");
    setFieldError(destinationInput, "");

    const originCity = getCityId(originInput);
    const destinationCity = getCityId(destinationInput);
    if (originCity && destinationCity && originCity === destinationCity) {
      setFieldError(originInput, "Города отправления и назначения не должны совпадать.");
      setFieldError(destinationInput, "Выберите другой город или аэропорт.");
    }
  });
}

swapButton.addEventListener("click", () => {
  [originInput.value, destinationInput.value] = [destinationInput.value, originInput.value];
  setFieldError(originInput, "");
  setFieldError(destinationInput, "");
  validateRoute();
  originInput.focus();
});
