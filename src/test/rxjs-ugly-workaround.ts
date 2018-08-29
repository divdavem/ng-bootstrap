// This file contains an ugly work-around while waiting for rxjs >= 6.2.2
// ( fix is in commit https://github.com/ReactiveX/rxjs/commit/01eefff2132f29dfe51476782c3e7f2db48f88f2 )

const originalDateNow = Date.now;
let insideDateNow = false;
const replacedDateNow = (...args) => {
  if (Date.now === replacedDateNow || insideDateNow) {
    return originalDateNow.call(this, ...args);
  }
  try {
    insideDateNow = true;
    return Date.now.call(this, ...args);
  } finally {
    insideDateNow = false;
  }
};
Date.now = replacedDateNow;
