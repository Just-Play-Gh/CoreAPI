import sys


def generateConfig(node_env, db_name, db_host, db_user, db_pswd, db_port, jwt_secret, redis_host, redis_secret, access_key, secret_key):
    options = f"""
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: {node_env}
    DB_NAME: {db_name}
    DB_HOST: {db_host}
    DB_USER: {db_user}
    DB_PASSWORD: {db_pswd}
    DB_PORT: {db_port}
    JWT_SECRET: {jwt_secret}
    JWT_TOKEN_EXPIRES_IN_SECONDS: 86400
    OTP_EXPIRES_IN_SECONDS: 300
    PORT: 8000
    GOOGLE_MAPS_URL:https://maps.googleapis.com/maps/api
    GOOGLE_MAPS_CLIENT_KEY:
    REDIS_HOST: {redis_host}
    REDIS_SECRET: {redis_secret}
    HUBTEL_SMS_CLIENT_ID:
    HUBTEL_SMS_CLIENT_SECRET:
    HUBTEL_SMS_CLIENT_URL:
    HUBTEL_SMS_CLIENT_FROM:PlayTestSms
    ACCESS_KEY: {access_key}
    SECRET_KEY: {secret_key}
"""
    print(options)


if __name__ == "__main__":
    # print(sys.argv)
    node_env = sys.argv[1]
    db_name = sys.argv[2]
    db_host = sys.argv[3]
    db_user = sys.argv[4]
    db_pswd = sys.argv[5]
    db_port = sys.argv[6]
    jwt_secret = sys.argv[7]
    redis_host = sys.argv[8]
    redis_secret = sys.argv[9]
    access_key = sys.argv[10]
    secret_key = sys.argv[11]
    generateConfig(node_env, db_name, db_host, db_user, db_pswd, db_port,
                   jwt_secret, redis_host, redis_secret, access_key, secret_key)
