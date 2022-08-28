import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  where,
  getDoc,
  query,
} from 'firebase/firestore/lite'
import Users from './users'
import Render from './render'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import '../styles/ui.css'
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCH-0jemPytvwPxatjc1-ZekLMQSi3QuF4',
  authDomain: 'estudiez-f87eb.firebaseapp.com',
  projectId: 'estudiez-f87eb',
  storageBucket: 'estudiez-f87eb.appspot.com',
  messagingSenderId: '237693345273',
  appId: '1:237693345273:web:e37ab9ce2f5330d79d7128',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth()
const storage = getStorage()

// Get a list of users from the database
// async function getStudents(db) {
//   const usersCol = collection(db, 'users')
//   const userSnapshot = await getDocs(usersCol)
//   const studentList = userSnapshot.docs.filter(doc => doc.data().category=='Student')
//   return studentList
// }

//class instances
const users = new Users(db)
const render = new Render(users)

// set category on click using event delegation
const setCat = document.querySelector("#setCategory")

try {
  setCat.addEventListener('click', e => {
    console.log(e.target.textContent.trim())
    let cat = e.target.textContent.trim() || document.querySelector('#category').textContent.trim()
    // console.log(cat)
    setCategory(cat)
  })
} catch (error) {
  console.log(error.message)
}
const setCategory = cat => {
  document
      .querySelectorAll('.facHide')
      .forEach(el => el.style.display = 'block')
  document
      .querySelectorAll('.studHide')
      .forEach(el => el.style.display = 'block')
  document
      .querySelectorAll('.parentHide')
      .forEach(el => el.style.display = 'block')
  users.category = cat
  // console.log('category: ', cat)
  try {
    document.querySelector('.signupTitle').textContent = `${cat} Sign Up`
  } catch (error) {
    console.log(error.message)
  }
  if (cat == 'Student') {
    document
      .querySelectorAll('.studHide')
      .forEach(el => el.style.display = 'none')
  } else if (cat == 'Parent') {
    document
      .querySelectorAll('.parentHide')
      .forEach(el => el.style.display = 'none')
  } else if (cat == 'Faculty') {
    document
      .querySelectorAll('.facHide')
      .forEach(el => el.style.display = 'none')
  }
}

// Sign up
const signupForm = document.querySelector('#signup')
try {
  signupForm.addEventListener('submit', e => {
    // prevent default behaviour of form submit event
    e.preventDefault()
    // console.log('submitting...')
    // extract form data
    const data = new FormData(e.target)
    const userDetails = {}

    for (const [name, value] of data) {
      userDetails[name] = value
    }

    // pick values from form fields
    // const email = signupForm.email.value
    // const password = signupForm.password.value

    // authenticate user with email and password
    createUserWithEmailAndPassword(
      auth,
      userDetails.email,
      userDetails.password
    )
      .then(cred => {
        // Recieve sign in response
        let user = cred.user
        console.log(user)
        //Confirmation mail
        sendEmailVerification(user)

        // Save user data to database
        users.addUser(userDetails).then(() => {
          console.log('user data saved to database')
          signupForm.reset()

          // users.getUser(user.email)
          if (user) {
            console.log('redirecting to dashboard')
            window.location.replace('./dashboard.html')
          }
        })
      })
      .catch(error => {
        alert(error.message)
      })
  })
} catch (error) {
  console.log(error.message)
}

// // sign user in
const loginForm =
  document.querySelector('#loginForm') && document.querySelector('#loginForm')
try {
  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    const email = loginForm.loginEmail.value
    const password = loginForm.loginPassword.value

    signInWithEmailAndPassword(auth, email, password)
      .then(cred => {
        if (cred.user) {
          console.log('user logged in')
          window.location.replace('./dashboard.html')
        }
      })
      .catch(err => {
        alert(err.message)
      })
  })
} catch (error) {
  console.log(error.message)
}

// subscription to auth changes (renderer)
onAuthStateChanged(auth, user => {
  console.log('subscribing to auth changes')
  if (user) {
    console.log(user)
    const email = user.email
    const photoURL =
      user.photoURL || 'https://via.placeholder.com/150?text=Profile+Image'
    users.getUser(email).then(resp => render.profile(resp))
    render.profImage(photoURL)
  } else if (location.pathname == '/dashboard.html') {
    window.location.replace('./index.html')
    // console.log(location.href, location.pathname)
    console.log('user not found')
  }
})

// get current user profile
const geteduClass = (user) => {
  users.getUser(user).then(resp => resp.eduClass)
}


// subscription to collection changes for faculty
const eduClass = users.getUser(auth.currentUser.email).then(resp => resp.eduClass)
const classRef = query(users.studentsRef, where("eduClass", "==", eduClass))
onSnapshot(classRef, (snapshot) => {
  snapshot.docChanges().forEach(change => {
    if (change.type === "added") {
      console.log("New city: ", change.doc.data());
    }
    if (change.type === "modified") {
        console.log("Modified city: ", change.doc.data())
    }
    if (change.type === "removed") {
        console.log("Removed city: ", change.doc.data())
    }
  });
}) 

// subscription to collection changes for students




// sign user out of auth session
const signoutBtn = document.querySelectorAll('#sign-out')
signoutBtn.forEach(el => el.addEventListener('click', () => logout()))
const logout = () => {
  signOut(auth)
    .then(() => {
      location.replace('./index.html')
      console.log('user signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
}

// Sign-up Form Validation =================================================================
const confirmForm = form => {
  let patt1 = /^[a-zA-Z]{2,}$/
  if (!patt1.test(form.first_name.value)) {
    //if(!(form.first.value.match(/^[a-zA-Z]{2,}$/))) {
    alert('Invalid First Name')
    form.first_name.focus()
    return false
  } else if (!patt1.test(form.last_name.value)) {
    //if(!(form.first.value.match(/^[a-zA-Z]{2,}$/))) {
    alert('Invalid Last Name')
    form.last_name.focus()
    return false
  }

  let patt2 = /^[a-zA-Z]{4,}$/
  if (!patt2.test(form.username.value)) {
    //    if(!(form.last.value.match(/^[a-zA-Z]{2,}$/))) {
    alert('Invalid User Name')
    form.username.focus()
    return false
  }
  let patt3 = /^\w.+\@+[a-z]+\.[a-z]{2,7}$/
  if (!patt3.test(form.email.value)) {
    alert('Invalid Email')
    form.email.focus()
    return false
  }

  let patt4 = /^[1-9]{1,3}$/
  if (!patt4.test(form.age.value)) {
    //if(!(form.age.value.match(/^[1-9]{1,3}$/))){
    alert('Invalid Age')
    form.age.focus
    return false
  }

  let patt5 = /^\w{6,}$/
  if (!patt5.test(form.pword.value)) {
    //   if(!(form.pword.value.match(/^.\w{5,}$/))){
    alert('Invalid Password')
    form.password.focus()
    return false
  }

  let patt6 = /^[1-9]{1,6}$/
  if (!patt6.test(form.userId.value)) {
    //if(!(form.age.value.match(/^[1-9]{1,3}$/))){
    alert('Invalid Age')
    form.userId.focus
    return false
  }

  if (!(form.confirmPassword.value == form.password.value)) {
    alert('Password must be the same')
    form.confirmPassword.focus()
    return false
  } else {
    return true
  }
}

// Profile Update function
const profUpdateForm = document.querySelector('#profUpdateForm')

profUpdateForm.addEventListener('submit', e => {
  e.preventDefault()
  const user = auth.currentUser
  const imageRef = ref(storage, `images/${user.uid}.jpg`)

  //grab image file
  let photo = profUpdateForm.profImage.files[0]
  //upload image
  uploadBytes(imageRef, photo)
    .then(() => {
      console.log('upload success')
      //set profile image url
      getDownloadURL(imageRef)
        .then(url => {
          // console.log(url)
          render.profImage(url)
          // console.log('updating profile phtotoURL for ', user.email)
          // const imageURL = url
          updateProfile(user, {
            photoURL: url,
          })
            .then(() =>
              console.log(
                'Profile updated ',
                'photoURL: ',
                user.photoURL,
                'displayName: ',
                user.displayName
              )
            )
            .catch(err => console.log('profile error: ' + err.message))
        })
        .catch(err => console.log('unable to get url'))
    })
    .catch(err => console.log('upload error: ' + err.message))
})
