# Tikui

![Tikui logo](./logo.svg)

Tikui is a MIT-licensed free software project allowing you to create a web pattern library.

## Prerequisites

- [Node.js](https://nodejs.org) LTS version

## Development

### Install dependencies

After cloning the repository, please go to the root Tikui directory and run this command:

```bash
npm install
```

### Serve

In development, you can run the application locally on [localhost:3000](http://localhost:3000/)

```bash
npm run serve
```

### Create a component

First of all, the source folder `src` follows the [Atomic Design](http://atomicdesign.bradfrost.com/table-of-contents/) methodology.

Here is an example of how to create a `button` component:

```bash
tikui create -p tikui button src/atom
```

> You can read the help from `tikui` and each commands using:
>
> - `tikui help` to see the global help
> - `tikui help create` to see a command help, here `create`

You can add inside the `src/atom/atom.pug` file:

```pug
include:componentDoc(height=55) button/button.md
```

> Note: [Pug](https://pugjs.org) is the template engine used by **Tikui** and indentations are important.

> You can also use `include:templateDoc button/button.md` if you don't want to see the component render, it's useful on bigger components like templates.

By default, there is only one style file in the `src` folder: `tikui.scss`.

It's because you're free to create your own structure even if we recommend you to follow the Atomic Design methodology.

So you may need to create the file:

```bash
touch src/atom/_atom.scss
```

And then, inside `tikui.scss`:

```scss
@use 'atom/atom';
```

Inside `src/atom/_atom.scss`:

```scss
@use 'button/button';
```

And inside `button.mixin.pug`:

```pug
mixin tikui-button
  button.tikui-button Button
```

Inside `src/atom/button/_button.scss`:

```scss
.tikui-button {
  border: 1px solid #47a;
  border-radius: 3px;
  background-color: #47a;
  padding: 5px;
  line-height: 1.5rem;
  color: #fff;
  font-size: 1rem;
}
```

As you can see in the browser, there is a documented blue button with an example of code.

More info can be found in the [component documentation](https://tikui.org/doc/component-doc.html) of **Tikui**.
