.PHONY: run-openhands

run-openhands:
	@echo "Starting OpenHands with current directory: $(PWD)"
	export SANDBOX_VOLUMES=$(PWD):/workspace:rw; \
	docker run -it --rm --pull=always \
		-e SANDBOX_RUNTIME_CONTAINER_IMAGE=docker.all-hands.dev/all-hands-ai/runtime:0.44-nikolaik \
		-e SANDBOX_VOLUMES=$$SANDBOX_VOLUMES \
		-e LOG_ALL_EVENTS=true \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-v ~/.openhands:/.openhands \
		-p 3000:3000 \
		--add-host host.docker.internal:host-gateway \
		--name openhands-app \
		docker.all-hands.dev/all-hands-ai/openhands:0.44 