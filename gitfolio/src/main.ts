import "franken-ui/js/core.iife";
import "franken-ui/js/icon.iife";

import "./assets/franken-ui.css";
import "./components/card/card-component.ts";

import { getUser, User } from "./api/git.ts";

setTimeout(async () => {
  const user: User = await getUser("joordih");
  // const repositories: Repository[] = await getRepositories("joordih");

  document.getElementById("name")!.innerHTML = user.name?.toString() || "";
  // const repositoriesList: HTMLElement = document.getElementById("repos")!;
  // repositories.forEach((repository: Repository) => {
  //   const repositoryElement: HTMLElement = document.createElement("li");

  //   repositoryElement.innerHTML = /* html */ `
  //     <a href="${repository.name}" target="_blank">${repository.name}</a>
  //     <span>${repository.description || "No description"}</span>
  //     <span>${repository.updated_at}</span>
  //   `;

  //   repositoriesList.appendChild(repositoryElement);
  // });
}, 0);
