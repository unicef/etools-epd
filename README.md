# eTools ePD

Partner facing module that makes the process of signing PDs more efficient.
 
# Deploy

- Make sure the superproject points to the desired submodule commit.
- For deploy config (.circleci/config.yml):
  `git submodule update --remote` - will use the last commit on the branch specified in .gitmodules for the submodule
  `git submodule update --checkout`- will use the submodule reference tracked by the superproject. For this you have to commit the submodule reference in the superproject repo every time before deploy
