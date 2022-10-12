class Render {
  constructor(users) {
    this.users = users
  }

  profile = ({
    first_name,
    last_name,
    gender,
    age,
    email,
    category,
    eduClass,
  }) => {
    let html
    let profile = document.querySelector('.profile')
    if (category == 'Faculty') {
      html = `
      <div class="profile ms-3 mt-3 text-center text-sm-start">
        <h3 class="title">
          <span id="first-name">${first_name}</span>
          <span id="last-name">${last_name}</span>
        </h3>
        <hr />
        <p>
          <span id="gmail">${email}</span><br />
          <span id="gender">${gender}</span> -
          <span id="category">${category}</span>
          <br />
          <span id="class">${eduClass}</span>
          <br />
        </p>
      </div>
          `
      // console.log(first_name, last_name, email, gender, category)
      profile.innerHTML = html
    } else if (category == 'Student' || category == 'Parent') {
      //PROFILE
      html = `
            <div class="profile ms-3 mt-3 text-center text-sm-start">
              <h3 class="title">
                <span id="first-name">${first_name}</span>
                <span id="last-name">${last_name}</span>
              </h3>
              <hr />
              <p>
                <span id="gender">${gender}</span> -
                <span id="age">${age && age}</span> YRS OLD
                <br>
                <span id="gmail">${email}</span>
                <br>
                <span id="category">${category}</span>
              </p>
            </div>
          `
      profile.innerHTML = html
      // console.log(profile)

      //BUTTONS
      document.querySelector('.updateScores button').textContent = 'Results'
      document.querySelector('.revClasses button').textContent =
        'Revision Classes'
      document.querySelector('.studyResources button').textContent =
        'Study Resources'

      document.querySelector("#updateScores > div > div > div.modal-footer > button.btn.btn-primary").textContent = 'Print Results';
    }
  }
    
  profImage = photoURL => {
      const profileImage = document.querySelectorAll('div.profile-image > img')
      profileImage.forEach(el => el.setAttribute('src', photoURL))
  }
    
    //THIS DAY IN HISTORY
  thisDayEvent = eventList => {
    const length = eventList.length
    let randNum = Math.floor(Math.random() * length)
    let randomEvent = eventList[randNum].text
    const thisDay = document.querySelector('#thisDay')
    thisDay.innerHTML = `Today in History: ${randomEvent}`
  }
}

// users.usersRef.where('email', '==', 'keyturn@live.com').onSnapshot(snapshot => {
//   snapshot.docChanges().forEach(change => {
//     const id = change.doc.id
//     console.log(
//       change.doc.data().first_name +
//         ' ' +
//         change.doc.data().last_name +
//         ' ' +
//         change.doc.id
//     )
//     const user = db.collection('users').doc(id)
//     console.log(user, auth.userUser)
//     renderProfile(user.doc.data())
//   })
// })

export default Render
