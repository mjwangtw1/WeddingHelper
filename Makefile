.PHONY: clean build upload
build:
	npm install --only=production
	zip -r code.zip . -x *.git*
	./upload.sh

pull:
	@echo ">>> Pull Code on Current branch [$(BRANCH)]"
	git pull origin $(BRANCH) --rebase

push: pull
	@echo ">>> Current branch [$(BRANCH)] Pushing Code"
	git push origin $(BRANCH)