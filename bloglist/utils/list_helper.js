const dummy = () => {return 1}

const totalLikes = (blogs) => {
  const result = blogs.reduce((accumulator, blog) => accumulator + blog.likes, 0)
  return result
}

module.exports = {
  dummy,
  totalLikes
}
