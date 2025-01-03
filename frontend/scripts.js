function rsvpSubmit() {
  const firstName = rsvpForm.firstName.value;
  const lastName = rsvpForm.lastName.value;
  const zipcode = rsvpForm.zipcode.value;

  const searchString = firstName + "+" + lastName + "+" + zipcode;
  const baseUrl = "https://mikipapa.pythonanywhere.com/search/";

  const url = baseUrl + searchString;

  const guestJSON = getData(url);
}

function rsvpYes(plusOne) {
  if (document.getElementById("plusOneFormSection")) {
    console.log("already added. Do not add again");
    return 0;
  }

  let plusOneSection = "";

  if (plusOne) {
    plusOneSection = `<section class="section-subpage" id="plusOneFormSection">
      <h2 class="h2-subpage">Yay! Will you bring a plus one?</h2>
      <p>Please select whether or not you will attend with a guest.</p>
      <form class="welcome-form" name="welcome-form">
        <button class="btn-welcome" type="button">Yes</button>
        <button class="btn-welcome" type="button">No</button>
      </form>
    </section>`;
  } else {
    // do not offer this guest the choice to add a plus one
    // move on to next section (submit rsvp button)
    rsvpCollect();
  }

  // add thhe new element and scroll
  div = document.getElementById("body");
  div.insertAdjacentHTML("beforeend", plusOneSection);
  // pageScroll();
}

function rsvpCollect() {
  const rsvpCollectFormSection = `    <section class="section-subpage">
      <h2 class="h2-subpage">We can't wait to see you!</h2>
      <p>
        Click the button below to confirm your RSVP. Don't worry, you can always
        return here to update your choices if anything changes.
      </p>
      <form class="rsvp-collect">
        <button class="rsvp-submit">Confirm RSVP</button>
      </form>
    </section>`;

  div = document.getElementById("body");
  div.insertAdjacentHTML("beforeend", rsvpCollectFormSection);
}

async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`response status: ${response.status}`);
    }

    const json = await response.json();

    if (isEmpty(json)) {
      window.alert(
        "Sorry, I can't find your invitation. Are you sure you were invited?"
      );
    } else {
      console.log(json);
      addWelcomeSection(json["firstName"], json["plusOne"]);
    }
  } catch (error) {
    console.error(error.message);
  }
}

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}

function addWelcomeSection(name, plusOne) {
  if (document.getElementById("welcome-section")) {
    console.log("already added. do not add again");
    return 0;
  }

  div = document.getElementById("body");
  welcomeSection = `
    <section class="section-subpage" id="welcome-section">
      <h2 class="h2-subpage">Welcome, ${name}!</h2>
      <p class="travel-text">Will you be attending our wedding?</p>
      <form class="welcome-form" name="welcome-form">
        <button class="btn-welcome" type="button" onclick="rsvpYes(${plusOne})">Yes</button>
        <button class="btn-welcome" type="button">No</button>
      </form>
    </section>`;
  div.insertAdjacentHTML("beforeend", welcomeSection);
  // pageScroll();

  return 0;
}

function pageScroll() {
  window.scrollBy(0, 7);
  scrolldelay = setTimeout(pageScroll, 12);
}
