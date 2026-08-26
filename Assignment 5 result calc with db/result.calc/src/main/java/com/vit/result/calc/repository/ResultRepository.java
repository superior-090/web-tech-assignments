package com.vit.result.calc.repository;
import com.vit.result.calc.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ResultRepository extends JpaRepository<Result, Integer> { }
