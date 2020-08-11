package filereader

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
	"sync"
)

//Record matches the actual log entry in file
type Record struct {
	timestamp int64
	StatusCode int64
	path string
};

// FileReader keeps track of file being read & continues to read from 
// offset if called again.
type FileReader struct {
	fileName string
	lock sync.RWMutex
};

// NewFileReader returns a pointer to a new instance
func NewFileReader(fileName string) *FileReader {
	return &FileReader {
		fileName: fileName, 
	};
};

//ReadRecords reads file records from the set offset to specified limit
func (sf *FileReader) ReadRecords (readFrom int64, readSize int64, readfileStream chan *Record) {
	sf.lock.Lock();
	defer sf.lock.Unlock();

	file, err := os.Open(sf.fileName);
	defer file.Close();
	reader := bufio.NewReader(file);

	if err != nil {
		panic(err);
	}
	file.Seek(readFrom, 0);
	sizeReadSoFar := int64(0);

	for {
		if sizeReadSoFar > readSize {
			return;
		}
		line, err := reader.ReadString('\n');
		if err == io.EOF {
			fmt.Println("End of file reached. Returning back");
			return;
		}
		if err != nil {
			panic(err);
		}

		lines := strings.Split(line, " ");
		if len(lines) != 3 {
			fmt.Println("Bad Record!");
			return;
		}
		timestamp, err := strconv.ParseInt(lines[0], 10, 64);
		if err != nil {
			panic(err);
		}
		statusCode, err := strconv.ParseInt(lines[1], 10, 64);
		if err != nil {
			panic(err);
		}
		path := lines[2];
		readfileStream <- &Record{
			timestamp: timestamp,
			StatusCode: statusCode,
			path: path,
		};
		sizeReadSoFar += int64(len(lines));
	}

};