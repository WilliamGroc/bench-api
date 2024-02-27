package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	_ "github.com/mattn/go-sqlite3"
)

func Connection() *sql.DB {
	db, err := sql.Open("sqlite3", "../sqlite.db")
	if err != nil {
		panic(err)
	}
	return db
}


type Movie struct {
	ID int `json:"id"`
	Title string `json:"title"`
	ReleaseYear int `json:"releaseYear"`
}

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/movies", func(w http.ResponseWriter, r *http.Request) {
		db := Connection()

		row, err := db.Query("SELECT * FROM movies")

		if err != nil {
			panic(err)
		}

		var movies []Movie

		for row.Next() {
			var movie Movie
			row.Scan(&movie.ID, &movie.Title, &movie.ReleaseYear)
			movies = append(movies, movie)
		}

		defer row.Close()

		w.Header().Add("Content-Type", "application/json")
		json.NewEncoder(w).Encode(movies)
	})

	r.Post("/movies", func(w http.ResponseWriter, r *http.Request) {
		db := Connection()

		var movie Movie
		json.NewDecoder(r.Body).Decode(&movie)

		_, err := db.Exec("INSERT INTO movies (title, releaseYear) VALUES (?, ?)", movie.Title, movie.ReleaseYear)

		if err != nil {
			panic(err)
		}

		w.Header().Add("Content-Type", "application/json")
		json.NewEncoder(w).Encode(movie)
	})

	fmt.Println("Server is running on port 3000")
	err := http.ListenAndServe(":3000", r)

	if err != nil {
		panic(err)
	}

}