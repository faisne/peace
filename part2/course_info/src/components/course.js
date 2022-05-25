const Header = ({course}) => <h1>{course}</h1>
const Part = ({part, exercises}) => <p>{part} {exercises}</p>
const Content = ({parts}) => parts.map(part => <Part key={part.id} part={part.name} exercises={part.exercises} />)
const Total = ({parts}) => <p>Number of exercises {parts.reduce((sum, part) => sum + part.exercises, 0)}</p>
const Course = ({course}) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course