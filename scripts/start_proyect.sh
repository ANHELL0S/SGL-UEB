#!/bin/bash

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

# Directorios del proyecto
SERVER_DIR="../server"
CLIENT_DIR="../client"

# Función para verificar si un contenedor ya existe
check_container() {
    local container_name=$1
    docker ps -a --format '{{.Names}}' | grep -q "^${container_name}$"
}

# Función para verificar si un contenedor está corriendo
is_container_running() {
    local container_name=$1
    docker ps --format '{{.Names}}' | grep -q "^${container_name}$"
}

# Función para iniciar PostgreSQL con Docker
start_postgresql_docker() {
    local container_name="lab_ueb_db"
    if check_container "$container_name"; then
        if is_container_running "$container_name"; then
            echo -e "${GREEN}✅ El contenedor ${container_name} ya está en ejecución.${RESET}"
        else
            echo -e "${YELLOW}🔄 El contenedor ${container_name} existe pero está detenido. Iniciándolo...${RESET}"
            docker start "$container_name"
        fi
    else
        echo -e "${YELLOW}\nLevantando contenedor de PostgreSQL con Docker...${RESET}"
        docker run -d --name "$container_name" -e POSTGRES_USER=BlliCstsZl7jbimsNIF8S47yup0KJ6m0 -e POSTGRES_PASSWORD=BlliCstsZl7jbimsNIF8S47yup0KJ6m0 -e POSTGRES_DB=lab_ueb_db -p 5434:5432 postgres
        echo -e "${GREEN}✅ Contenedor de PostgreSQL iniciado exitosamente.${RESET}"
    fi
}

# Función para iniciar Redis con Docker
start_redis_docker() {
    local container_name="redis-container"
    if check_container "$container_name"; then
        if is_container_running "$container_name"; then
            echo -e "${GREEN}✅ El contenedor ${container_name} ya está en ejecución.${RESET}"
        else
            echo -e "${YELLOW}🔄 El contenedor ${container_name} existe pero está detenido. Iniciándolo...${RESET}"
            docker start "$container_name"
        fi
    else
        echo -e "${YELLOW}\nLevantando contenedor de Redis con Docker...${RESET}"
        docker run --name "$container_name" -d -p 6379:6379 redis:latest redis-server --requirepass lab_ueb_redis@
        echo -e "${GREEN}✅ Contenedor de Redis iniciado exitosamente.${RESET}"
    fi
}

# Función para iniciar el servidor con npm run dev
start_server() {
    echo -e "${YELLOW}\nIniciando el servidor...${RESET}"
    if [ -d "$SERVER_DIR" ]; then
        cd "$SERVER_DIR" || exit
        npm install
        npm run dev &
        echo -e "${GREEN}✅ Servidor iniciado en modo desarrollo.${RESET}"
        cd - || exit
    else
        echo -e "${RED}❌ No se encontró el directorio del servidor (${SERVER_DIR}).${RESET}"
    fi
}

# Función para iniciar el cliente con npm run dev
start_client() {
    echo -e "${YELLOW}\nIniciando el cliente...${RESET}"
    if [ -d "$CLIENT_DIR" ]; then
        cd "$CLIENT_DIR" || exit
        npm install
        npm run dev &
        echo -e "${GREEN}✅ Cliente iniciado en modo desarrollo.${RESET}"
        cd - || exit
    else
        echo -e "${RED}❌ No se encontró el directorio del cliente (${CLIENT_DIR}).${RESET}"
    fi
}

# Función para iniciar el proyecto completo
start_project() {
    echo -e "${YELLOW}\nLevantando todos los servicios...${RESET}"
    start_postgresql_docker
    start_redis_docker
    start_server
    start_client
    echo -e "${CYAN}\nEl proyecto está en ejecución.${RESET}"
}

# Función para detener contenedores y procesos npm
stop_containers_and_processes() {
    echo -e "${YELLOW}\nDeteniendo contenedores de Docker...${RESET}"
    docker stop lab_ueb_db redis-container 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Contenedores detenidos.${RESET}"
    else
        echo -e "${RED}❌ Error al detener los contenedores.${RESET}"
    fi

    echo -e "${YELLOW}\nDeteniendo procesos de npm run dev...${RESET}"
    # Buscar y detener procesos de npm en el cliente
    CLIENT_PID=$(ps aux | grep 'npm run dev' | grep './client' | awk '{print $2}')
    if [ -n "$CLIENT_PID" ]; then
        kill -9 $CLIENT_PID
        echo -e "${GREEN}✅ Proceso npm run dev del cliente detenido.${RESET}"
    else
        echo -e "${RED}❌ No se encontró un proceso npm run dev del cliente.${RESET}"
    fi

    # Buscar y detener procesos de npm en el servidor
    SERVER_PID=$(ps aux | grep 'npm run dev' | grep './server' | awk '{print $2}')
    if [ -n "$SERVER_PID" ]; then
        kill -9 $SERVER_PID
        echo -e "${GREEN}✅ Proceso npm run dev del servidor detenido.${RESET}"
    else
        echo -e "${RED}❌ No se encontró un proceso npm run dev del servidor.${RESET}"
    fi
}


# Función principal
menu() {
    while true; do
        echo -e "${CYAN}\nMenu principal:${RESET}"
        echo -e "${YELLOW}1) Iniciar proyecto completo"
        echo "2) Detener contenedores"
        echo "3) Salir"
        read -p "Selecciona una opción: " option

        case $option in
            1) start_project ;;
            2) stop_containers ;;
            3) echo -e "${CYAN}Saliendo...${RESET}"; exit 0 ;;
            *) echo -e "${RED}Opción inválida. Intenta nuevamente.${RESET}" ;;
        esac
    done
}

# Ejecutar menú
menu
