function rsvpSubmit() {
  const firstName = rsvpForm.firstName.value;
  const lastName = rsvpForm.lastName.value;
  const zipcode = rsvpForm.zipcode.value;

  const searchString = firstName + "+" + lastName + "+" + zipcode;
  const baseUrl = "http://127.0.0.1:5000/search/";

  const url = baseUrl + searchString;

  const guestJSON = getData(url);
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
    }

    console.log(json);
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
