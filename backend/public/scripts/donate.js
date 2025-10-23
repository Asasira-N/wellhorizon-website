document.addEventListener("DOMContentLoaded", () => {
  // Elements (try both selectors for the form)
  const amountButtons = document.querySelectorAll(".donation-amount");
  const customAmountInput = document.getElementById("amount");
  const frequencyRadios = document.querySelectorAll('input[name="frequency"]');
  const donateForm = document.querySelector(".donation-form") || document.getElementById("donateForm");

  /* ---------- Preset Amount Buttons ----------
     - highlight clicked button and fill the custom input
  */
  if (amountButtons.length && customAmountInput) {
    amountButtons.forEach(button => {
      button.addEventListener("click", () => {
        // remove active from all then add to clicked
        amountButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        // set input (dataset expected to be numeric, e.g. data-amount="50")
        const amount = button.dataset.amount;
        customAmountInput.value = amount;
      });
    });
  }

  /* ---------- Frequency selection visual highlight ---------- */
  if (frequencyRadios.length) {
    // set initial visual state
    frequencyRadios.forEach(r => {
      if (r.checked) r.parentElement.style.fontWeight = "bold";
      r.addEventListener("change", () => {
        frequencyRadios.forEach(rr => rr.parentElement.style.fontWeight = "normal");
        r.parentElement.style.fontWeight = "bold";
      });
    });
  }

  /* ---------- Form submission with validation ---------- */
  if (donateForm) {
    donateForm.addEventListener("submit", e => {
      e.preventDefault();

      const amountVal = customAmountInput ? parseFloat(customAmountInput.value) : NaN;
      if (isNaN(amountVal) || amountVal <= 0) {
        showFormMessage("Please enter a valid donation amount.", "error");
        return;
      }

      const frequency = (document.querySelector('input[name="frequency"]:checked') || {}).value || "one-time";

      // TODO: integrate payment gateway or send to server here.
      // For now show confirmation and reset form.
      showFormMessage(`🎉 Thank you for your ${frequency} donation of $${amountVal.toFixed(2)}!`, "success");

      // Reset UI
      customAmountInput.value = "";
      amountButtons.forEach(b => b.classList.remove("active"));
      if (frequencyRadios.length) {
        frequencyRadios.forEach(r => r.parentElement.style.fontWeight = "normal");
        frequencyRadios[0].checked = true;
        frequencyRadios[0].parentElement.style.fontWeight = "bold";
      }
    });
  }

  /* ---------- Helper: show inline messages in the form ---------- */
  function showFormMessage(text, type = "info") {
    if (!donateForm) {
      alert(text);
      return;
    }
    let msg = donateForm.querySelector(".donation-message");
    if (!msg) {
      msg = document.createElement("div");
      msg.className = "donation-message";
      donateForm.insertBefore(msg, donateForm.firstChild);
    }
    msg.textContent = text;
    msg.className = "donation-message " + type;
    // auto-remove after 6 seconds
    setTimeout(() => { if (msg && msg.parentElement) msg.remove(); }, 6000);
  }
});
