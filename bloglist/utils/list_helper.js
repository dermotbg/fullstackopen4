const dummy = () => {return 1}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, blog) => accumulator + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  return blogs.reduce((topVal, currentVal) => {
    return (topVal && topVal.likes > currentVal.likes)
      ? topVal
      : currentVal
  })
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}
