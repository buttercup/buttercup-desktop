# How to contribute

First of all, thank you for taking the time to contribute to this project. We've tried to make a stable project and try to fix bugs and add new features continuously. You can help us do more.

Before you start, read the **README.md** file for info on the project and how to set it up.

## Getting started

### Check out the roadmap

We have some functionalities in mind and we have issued them and there is a *milestone* label available on the issue. If there is a bug or a feature that is not listed in the **issues** page or there is no one assigned to the issue, feel free to fix/add it! Although it's better to discuss it in the issue or create a new issue for it so there is no confilcting code.

### Writing some code!

Contributing to a project on Github is pretty straight forward. If this is you're first time, these are the steps you should take.

- Fork this repo.

And that's it! Read the code available and change the part you don't like! You're change should not break the existing code and should pass the tests.

If you're adding a new functionality, start from the branch **master**. It would be a better practice to create a new branch and work in there.

When you're done, submit a pull request and for one of the maintainers to check it out. We would let you know if there is any problem or any changes that should be considered.

### Tests

We've written tests and you can run them to assure the stability of the code, just try `grunt build`. If you're adding a new functionality please write a test for it.

### Documentation

Every chunk of code that may be hard to understand has some comments above it. If you write some new code or change some part of the existing code in a way that it would not be functional without changing it's usages, it needs to be documented.
