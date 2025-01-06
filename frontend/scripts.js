var guestJSON;

function rsvpSubmit() {
  const firstName = rsvpForm.firstName.value;
  const lastName = rsvpForm.lastName.value;
  const zipcode = rsvpForm.zipcode.value;

  const searchString = firstName + "+" + lastName + "+" + zipcode;
  const baseUrl = "https://mikipapa.pythonanywhere.com/search/";

  const url = baseUrl + searchString;

  getData(url, 1);
}

function rsvpYes(plusOne) {
  let plusOneSec = document.getElementById("plusOneFormSection");
  if (plusOneSec) {
    console.log(
      "already added plusOneSec. removing existing verison and re-adding."
    );
    plusOneSec.remove();
  }

  // set yes button to enabled
  document.getElementById("btnRsvpYes").classList.add("btn-selected");

  // if we hit no and then hit yes, remove rsvpCollect and switch buttons
  const rsvpCollectSec = document.getElementById("rsvpCollect");

  if (rsvpCollectSec) {
    console.log("switched from no to yes. removing rsvpCollect");
    rsvpCollectSec.remove();
  }

  btn = document.getElementById("btnRsvpNo");
  btn.classList.remove("btn-selected");

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
    rsvpCollect(1);
  }

  // add thhe new element and scroll
  div = document.getElementById("div-rsvp-content");
  div.insertAdjacentHTML("beforeend", plusOneSection);
  // pageScroll();
}

// if tone == 0, it is sad tone, because they cannot attend
// else, it is happy tone, because they can.
function rsvpCollect(tone) {
  // in case user hits yes then no
  const plusOneSec = document.getElementById("plusOneFormSection");
  if (!tone && plusOneSec) {
    plusOneSec.style.display = "None";
  }

  if (!tone) {
    document.getElementById("btnRsvpNo").classList.add("btn-selected");
    document.getElementById("btnRsvpYes").classList.remove("btn-selected");
  }

  // if user doesn't have a plus one, selected no, then selects yes
  if (
    !guestJSON["plusOne"] &&
    document.getElementById("btnRsvpNo").classList.contains("btn-selected")
  ) {
    flipButtons("btnRsvpYes", "btnRsvpNo");
  }

  // check if rsvpCollect has already been added
  const rsvpCollectSec = document.getElementById("rsvpCollect");

  if (rsvpCollectSec) {
    console.log(
      "already added rsvpCollect. removing existing verison and re-adding."
    );
    rsvpCollectSec.remove();
  }

  // add enabled style

  // document.getElementById("btnRsvpNo").classList.add("btn-selected");

  const headingMsg = tone
    ? "We can't wait to see you!"
    : "We are sorry to miss you.";

  const rsvpCollectFormSection = `      <section class="section-subpage" id="rsvpCollect">
        <h2 class="h2-subpage">${headingMsg}</h2>
        <p>
          Click below to confirm your RSVP. Don't worry, you can
          always return here to update your choices if anything changes.
        </p>
        <form class="rsvp-collect">
          <button class="rsvp-submit" onclick="rsvpConfirm(${tone})" type="button">
            Confirm RSVP
          </button>
        </form>
      </section>`;

  div = document.getElementById("div-rsvp-content");
  div.insertAdjacentHTML("beforeend", rsvpCollectFormSection);
}

async function getData(url, iteration) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`response status: ${response.status}`);
    }

    if (iteration == 1) {
      guestJSON = await response.json();
    }

    if (isEmpty(guestJSON)) {
      window.alert(
        "Sorry, I can't find your invitation. Are you sure you were invited?"
      );
    } else {
      if (iteration == 1) {
        div = document.getElementById("rsvpFormSection");
        div.style.display = "None";
        console.log("hidding rsvpform");
        addWelcomeSection(guestJSON["firstName"], guestJSON["plusOne"]);
      }
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

  div = document.getElementById("div-rsvp-content");
  welcomeSection = `
    <section class="section-subpage" id="welcome-section">
      <h2 class="h2-subpage">Welcome, ${name}!</h2>
      <p class="travel-text">Will you be attending our wedding?</p>
      <form class="welcome-form" name="welcome-form">
        <button id="btnRsvpYes" class="btn-welcome" type="button" onclick="rsvpYes(${plusOne})">Yes</button>
        <button id="btnRsvpNo" class="btn-welcome" type="button" onclick="rsvpCollect(0)">No</button>
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

//

function rsvpConfirm(attending) {
  // send update to api
  const baseUrl = "https://mikipapa.pythonanywhere.com/edit/";
  // const baseUrl = "http://127.0.0.1:5000/edit/";

  // clear the plusOne if the guest is decling to attend
  // let plusOne = 0 ? !tone : guestJSON["plusOne"];

  const searchString = `${guestJSON["guestID"]}+${guestJSON["plusOne"]}+${attending}`;

  const url = baseUrl + searchString;

  getData(url, 2);

  // setTimeout(window.location.replace("index.html"), 1000);

  // const guestJSON = getData(url);
  // console.log(guestJSON);

  // redirect to home page
}

function flipButtons(btn1, btn2) {
  btn1 = document.getElementById(btn1);
  btn2 = document.getElementById(btn2);

  if (btn1.classList.contains("btn-selected")) {
    btn1.classList.remove("btn-selected");
    btn2.classList.add("btn-selected");
  } else if (btn2.classList.contains("btn-selected")) {
    btn1.classList.add("btn-selected");
    btn2.classList.remove("btn-selected");
  }
}
