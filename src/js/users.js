import { 
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  getDocs
} from "firebase/firestore/lite"

class Users {
  constructor(db) {
    this.usersRef = collection(db, 'users')
    this.scoresRef = collection(db, 'scores')
    this.studentsRef = collection(db,'students')
    this.category
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }

  async getUser(email) {
    const userRef = query(this.usersRef, where('email', '==', email))
    const user = await getDocs(userRef).then(userData => userData.docs[0].data())
    return user
  }

  async addUser({
    first_name,
    last_name,
    email,
    gender,
    age,
    eduClass,
    address,
    childId,
    studentId
  }) {
    const now = new Date()
    const reg_date = Timestamp.fromDate(now)

    if (this.category == 'Parent') {
      const userData = {
        first_name,
        last_name,
        email,
        gender,
        address,
        category: this.category,
        childId,
        reg_date,
      }
      // console.log(userData)
      const response = await addDoc(this.usersRef, userData)
    } else if (this.category == 'Student') {
      const userData = {
        first_name,
        last_name,
        email,
        age,
        studentId,
        gender,
        address,
        category: this.category,
        eduClass,
        reg_date,
      }
      console.log(userData)
      const response = await addDoc(this.usersRef, userData)
      const studentData = {
        class: eduClass,
        studentId,
        reg_date,
        first_name,
        last_name,
      }
      addDoc(this.studentsRef, studentData)
        .then(() => console.log(`studentData added`))
    } else if (this.category == 'Faculty') {
      const userData = {
        first_name,
        last_name,
        email,
        gender,
        address,
        category: this.category,
        eduClass,
        reg_date,
      }
      // console.log(userData)
      const response = await addDoc(this.usersRef, userData)
    }
    return this
  }
}

export default Users