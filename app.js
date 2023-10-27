const activityData = []

// registers a user
function registerUser(username, password) {
  //stores user data in local storage
  localStorage.setItem('username', username)
  localStorage.setItem('password', password)
  console.log('user registered')

  //hides reg and shows log activity
  document.getElementById('registration').style.display = 'none'
  document.getElementById('log-activity').style.display = 'block'
  
}

//gets the user's id/username
function getUserId() {
  return localStorage.getItem('username')
}

//updates user statistics
function updateStatistics() {
  const userId = getUserId()
  const statisticsDiv = document.getElementById('statistics')
  statisticsDiv.innerHTML = ''

  if (userId) {
    //retrieves users activity data from local storage
    const userActivity = JSON.parse(localStorage.getItem(userId)) || []

    if (userActivity.length > 0) {
      statisticsDiv.innerHTML = '<h3>User Statistics</h3>'
      userActivity.forEach((entry) => {
        const activityItem = document.createElement('div')
        activityItem.textContent = `Activity: ${entry.activity}, Duration: ${entry.duration} minutes`
        statisticsDiv.appendChild(activityItem)
      })
    }
  } else {
    statisticsDiv.innerHTML = '<p>user not registered - please register to log activity</p>'
  }
}

//logs activity data
function logActivity(activity, duration) {
  //retrieve user data from local storage
  const userId = getUserId()

  //stores activity data in local storage
  const userActivity = JSON.parse(localStorage.getItem(userId)) || []
  userActivity.push({ activity, duration })
  localStorage.setItem(userId, JSON.stringify(userActivity))

  updateStatistics()
}

// listens for user registration
document.getElementById('registration-form').addEventListener('submit', (event) => {
  event.preventDefault()
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  registerUser(username, password)
})

//listens for logging activity
document.getElementById('log-activity-form').addEventListener('submit', (event) => {
  event.preventDefault()
  const activity = document.getElementById('activity').value
  const duration = parseInt(document.getElementById('duration').value)
  if (activity && duration) {
    logActivity(activity, duration)
  }
})
updateStatistics()