var guestJSON;

function rsvpSubmit() {
  const firstName = rsvpForm.firstName.value;
  const lastName = rsvpForm.lastName.value;
  const zipcode = rsvpForm.zipcode.value;

  const searchString = firstName + "+" + lastName + "+" + zipcode;
  const baseUrl = "https://mikipapa.pythonanywhere.com/wedding-api/search/";

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
      <p class="travel-text">Please select whether or not you will attend with a guest.</p>
      <form class="welcome-form" name="welcome-form">
        <button class="btn-welcome" id="btnPlusOneYes" type="button" onclick="plusOneCollect()">Yes</button>
        <button class="btn-welcome" id="btnPlusOneNo" type="button" onclick="rsvpCollect(1, 1)">No</button>
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

function plusOneCollect() {
  // check if element is already added. If so, remove and continue
  if (document.getElementById("plusOneEntrySection")) {
    document.getElementById("plusOneEntrySection").remove();
  }

  if (document.getElementById("rsvpCollect")) {
    document.getElementById("rsvpCollect").remove();
  }

  // if this is triggeded, user just hit yes. Remove selected from no button if applied, add selected to yes button
  noBtn = document.getElementById("btnPlusOneNo");
  try {
    noBtn.classList.remove("btn-selected");
  } catch {
    console.log("no button was not selected");
  }
  yesBtn = document.getElementById("btnPlusOneYes");
  yesBtn.classList.add("btn-selected");

  // add form for user to enter plus one
  plusOneEntry = `<section class="section-subpage" id="div-rsvp-content">
      <section id="plusOneEntrySection">
        <h2 class="h2-subpage">Who is joining you?</h2>
        <form name="plusOneEntryForm">
          <div style="display: flex; flex-direction: column">
            <label>Your plus one's name</label>
            <input id="plusOneNameInput" class="text-input" />
          </div>
          <button class="btn-review" type="button" onclick="confirmRSVP()">Review and submit</button>
        </form>
      </section>
 `;

  div = document.getElementById("div-rsvp-content");
  div.insertAdjacentHTML("beforeend", plusOneEntry);
}

function confirmRSVP() {
  //get updated plusOne info
  guestJSON["plusOne"] = document.getElementById("plusOneNameInput").value;

  // hide old forms
  const plusOneSec = document.getElementById("plusOneFormSection");
  plusOneSec.style.display = "None";

  document.getElementById("plusOneEntrySection").style.display = "None";
  document.getElementById("welcome-section").style.display = "none";

  const confirmSec = `    <section id="div-rsvp-content" class="section-subpage">
      <section id="confirmSection">
        <h2 class="h2-subpage">Does everything look okay?</h2>
        <p class="travel-text">
          ${guestJSON["firstName"]} ${
    guestJSON["lastName"]
  } will attend on July 11th with their guest, ${capitalizeFirstLetter(
    guestJSON["plusOne"]
  )}.
        </p>
        <button class="rsvp-submit"
        style="width: 100%; margin-bottom: 10px"
        onclick="rsvpConfirm(1)">
          Submit your RSVP
        </button>
        <p style="font-size: 18px">
          Don't worry, you can always return to our website later to update your
          information if needed.
        </p>
      </section>`;

  div = document.getElementById("div-rsvp-content");
  div.insertAdjacentHTML("beforeend", confirmSec);
  // display all information and then allow user to submit
}

// if tone == 0, it is sad tone, because they cannot attend
// else, it is happy tone, because they can.
function rsvpCollect(tone, plusOne) {
  // in case user hits yes then no
  const plusOneSec = document.getElementById("plusOneFormSection");
  if (!tone && plusOneSec && !plusOne) {
    plusOneSec.style.display = "None";
  }

  // select no btn
  // unselect yes btn, if selected

  if (!plusOne) {
    let noBtn = document.getElementById("btnRsvpNo");
    let yesBtn = document.getElementById("btnRsvpYes");

    noBtn.classList.add("btn-selected");
    if (yesBtn.classList.contains("btn-selected")) {
      yesBtn.classList.remove("btn-selected");
    }
  }

  if (plusOne) {
    let yesBtn = document.getElementById("btnPlusOneYes");
    let noBtn = document.getElementById("btnPlusOneNo");

    noBtn.classList.add("btn-selected");
    if (yesBtn.classList.contains("btn-selected")) {
      yesBtn.classList.remove("btn-selected");
    }
  }

  // check if rsvpCollect has already been added
  const rsvpCollectSec = document.getElementById("rsvpCollect");
  const plusOneEntrySec = document.getElementById("plusOneEntrySection");

  if (rsvpCollectSec) {
    console.log(
      "already added rsvpCollect. removing existing verison and re-adding."
    );
    rsvpCollectSec.remove();
  }
  if (plusOneEntrySec) {
    plusOneEntrySection.remove();
  }

  const headingMsg = tone
    ? "We can't wait to see you!"
    : "We are sorry to miss you.";

  const rsvpCollectFormSection = `      <section class="section-subpage" id="rsvpCollect">
        <h2 class="h2-subpage">${headingMsg}</h2>
        <p class="travel-text">
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

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
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
        <button id="btnRsvpYes" class="btn-welcome" type="button" onclick="rsvpYes('${plusOne}')">Yes</button>
        <button id="btnRsvpNo" class="btn-welcome" type="button" onclick="rsvpCollect(0, 0)">No</button>
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
  const baseUrl = "https://mikipapa.pythonanywhere.com/wedding-api/edit/";
  // const baseUrl = "http://127.0.0.1:5000/edit/";

  // clear the plusOne if the guest is decling to attend
  // let plusOne = 0 ? !tone : guestJSON["plusOne"];

  const searchString = `${guestJSON["guestID"]}+${guestJSON["plusOne"]}+${attending}`;

  const url = baseUrl + searchString;

  getData(url, 2);

  window.location.replace("index.html");
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
