async function notifyUser(userId, { title, message, type }) {
  console.log(`[User ${userId}] ${type.toUpperCase()}: ${title} - ${message}`);
}

async function notifyAdmin({ title, message, type }) {
  console.log(`[Admin] ${type.toUpperCase()}: ${title} - ${message}`);
}

module.exports = { notifyUser, notifyAdmin };
