<img src="icon.png" align="right" width = 100  height = 105 />

# Graana
Graana Web Application.

## Getting Started

### Prerquisites
Install the following prerquisites.

#### [Node.js (Version 8.9)](https://nodejs.org/en/)

We recommend installing node through nvm. In order to install node through nvm please follow the instructions at their [github](https://github.com/creationix/nvm) page.

#### Installation
After successful installation of the above, navigate to the project directory on your command prompt where the file `package.json` is located and run the following the command.

```npm i```

This will install all the related dependencies as specified in the `package.json` file.

Verify the path to the API server in `webpack.config.js`. By default the `graana-api` server runs on `http://localhost:3000`.
```
  devServer: {
    contentBase: '/',
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/auth': {
        target: 'http://localhost:3000',
        secure: false
      }
    }
  }
```
We are using `webpack-dev-server` in development mode. Run the following command to start the server.

```npm run dev```

`webpack-dev-server` by default runs on `http://localhost:8080`
