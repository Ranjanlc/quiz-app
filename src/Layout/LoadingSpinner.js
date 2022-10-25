import classes from './LoadingSpinner.module.css';
const LoadingSpinner = (props) => {
  return (
    <main>
      <div className={classes.container}>
        <svg
          className={classes.spinner}
          width="155"
          height="155"
          viewBox="0 0 155 155"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className={classes.circleAnimation}
            cx="77.5"
            cy="77.5"
            r="60"
            stroke="currentColor"
            strokeWidth="35"
          />
          <path
            d="M120.329 35.48a59.998 59.998 0 0 1 6.712 75.868"
            stroke="currentColor"
            strokeWidth="35"
          />
        </svg>
        <p>Loading</p>
      </div>
    </main>
  );
};

export default LoadingSpinner;
