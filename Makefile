start: 
	docker-compose up -d

stop: 
	docker-compose down

run: 
	docker-compose up -d --build --remove-orphans

restart: 
	docker-compose down && docker-compose up -d --build --remove-orphans

update: 
	git pull

configure_nginx: 
	sudo ln -f wearperformance.raiser.dev.conf ../proxy/sites/

logs:
	while true; do docker-compose logs -f; sleep 2; done