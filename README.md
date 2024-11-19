## 프로젝트 실행 방법

1. **환경 설정**
   - Node.js : v18.17.0
   - Prisma ORM, PostgreSQL
   - `.env` 파일에 환경 변수 설정 (이메일에 내용 첨부해놓겠습니다!)
   - ERD : https://www.erdcloud.com/d/GhMQFePXnfRyyRyWZ

2. **실행**
  ```bash
  # 패키지 설치 
  $ npm install
  ```
  ```bash
  # 데이터베이스 마이그레이션
  $ prisma db pull
  ```
  ```bash
  # 애플리케이션 실행
  $ npm run start
  ```
  - 서버는 `http://localhost:3000`에서 실행됩니다.

## 구현한 기능 목록
1. **유저 등록 API (회원)**:
   - 유저 정보 등록 API를 구현하여 이메일과 사용자 정보를 저장합니다.

2. **검색어 저장 API (비회원, 회원)**:
   - 회원과 비회원의 검색어를 저장하는 API입니다. 회원은 이메일을, 비회원은 IP를 통해 식별하며, 중복된 검색어를 저장하지 않도록 유니크 제약을 두었습니다.

3. **24시간 인기 검색어 조회**:
   - 지난 24시간 동안 가장 많이 검색된 키워드를 조회할 수 있는 API입니다. 인기 검색어를 정렬하여 사용자에게 제공합니다.

## API 사용 방법 
1. **유저 등록 API (회원)**
    <br>POST /api/user
    <br>Request
    ```
    {
        "email": "qwer1234@naver.com",
        "age": "30",
        "gender": "W",
        "region": "JAPAN"
    }
    ```

    Response
    - 회원 등록 성공 시
    ```
    {
        "statusCode": 201,
        "message": "유저가 성공적으로 등록되었습니다."
    }
    ```
    - 실패 시 
      1. 이미 등록된 이메일일 경우 
      ```
      {
          "message": "Conflict",
          "statusCode": 409
      }
      ```
2. **검색어 저장 API (비회원, 회원)**
    <br>POST /api/search/keywords
    <br>Request
    - 비회원
    ```
    {
        "keyword": "붕어빵",
        "ip": "123.456.789.012"
    }
    ```
    - 회원
    ``` 
    {
        "keyword": "붕어빵",
        "email": "qwer1234@naver.com"
    }
    ```

    Response 
    - 성공 시 
    ```
    {
        "statusCode": 201,
        "saveData": {
            "id": 20,
            "keyword": "붕어빵",
            "createdAt": "2024-11-18T04:19:30.220Z",
            "user_id": 2,
            "ip": null
        }
    }
    ```

    - 실패 시
      1. 중복으로 인한 실패 시
      ```
      {
          "message": "이미 동일한 검색어가 저장되어 있습니다.",
          "error": "Conflict",
          "statusCode": 409
      }
      ```
      2. 검색 키워드 누락 시
      ```
      {
          "message": [
              "keyword must be a string"
          ],
          "error": "Bad Request",
          "statusCode": 400
      }
      ```
      3. 회원 요청 시 일치하는 이메일이 없는 경우
      ```
      {
          "message": "일치하는 이메일이 존재하지 않습니다.",
          "error": "Not Found",
          "statusCode": 404
      }
      ```

4. **인기검색어 조회 API**
    <br>GET /api/search/trending
    <br>Request 
    - Query: ?age=20&gender=M&region=KOREA
       - age (String)
       - gender (String)
       - region (String)

    Response
    ```
    {
      "statusCode": 200,
      "data": [
          {
              "keyword": "붕어빵",
              "count": 3,
              "rank": 1
          },
          {
              "keyword": "군밤",
              "count": 2,
              "rank": 2
          },
          {
              "keyword": "고구마",
              "count": 1,
              "rank": 3
          }
      ]
    }
    ```
